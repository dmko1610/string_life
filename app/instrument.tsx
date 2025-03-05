import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, ImageSource } from 'expo-image';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import { IconButton, ProgressBar, useTheme } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';

import images from '@/helpers/images';

import { Instrument } from '.';

const typesToIcons: Record<string, ImageSource> = {
  electro: images.electroGuitarLarge,
  acoustic: images.acousticGuitarLarge,
  bass: images.bassGuitarLarge,
  ukulele: images.ukuleleLarge,
};

function typeToIcon(type: keyof typeof typesToIcons): ImageSource {
  return typesToIcons[type];
}

const TARGET_TIME_SECONDS = 360_000; // 100 hours

export default function InstrumentDetails() {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const router = useRouter();

  const { id } = useLocalSearchParams();

  const [type, setType] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [replacementDate, setReplacementDate] = useState<Date | undefined>(
    undefined
  );
  const [pressed, setPressed] = useState(false);

  const playingRef = useRef(false);

  const fetchData = useCallback(async () => {
    const data: Instrument | null = await db.getFirstAsync(
      'SELECT * FROM stringLife WHERE id=?',
      [String(id)]
    );

    if (data) {
      setType(data.type);
      setProgress(data.progress || 0);
      setReplacementDate(new Date(data.replacement_date as number));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        if (nextAppState === 'active' && playingRef.current === true) {
          const startTime = await AsyncStorage.getItem('playStartTime');

          if (startTime) {
            const elapsed = Math.floor((Date.now() - Number(startTime)) / 1000);
            setProgress((prev) => (prev + elapsed) / TARGET_TIME_SECONDS);
          }
        }
      }
    );

    return () => subscription.remove();
  }, [pressed]);

  const daysSince = replacementDate
    ? Math.floor(
        (Date.now() - replacementDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  const startPlay = async () => {
    playingRef.current = true;
    const startTime = Date.now();

    await AsyncStorage.setItem('playStartTime', String(startTime));
  };

  const stopPlay = async () => {
    playingRef.current = false;
    const startTime = await AsyncStorage.getItem('playStartTime');

    if (startTime) {
      const elapsed = Math.floor((Date.now() - Number(startTime)) / 1000);
      setProgress((prev) => (prev + elapsed) / TARGET_TIME_SECONDS);

      await db.runAsync(
        'UPDATE stringLife SET progress= progress + ? WHERE id=?',
        elapsed / TARGET_TIME_SECONDS,
        String(id)
      );
    }

    await AsyncStorage.removeItem('playStartTime');
  };

  return (
    <SafeAreaView
      edges={['left', 'right', 'top', 'bottom']}
      style={[styles.instrument, { backgroundColor: colors.background }]}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={[styles.header, { color: colors.onBackground }]}>
          {type.toUpperCase()}
        </Text>

        <IconButton
          icon={'arrow-u-right-bottom'}
          mode="contained-tonal"
          size={30}
          iconColor={colors.onPrimary}
          containerColor={colors.primary}
          animated={true}
          onPress={() => router.back()}
        />
      </View>

      <View style={{ flex: 1, justifyContent: 'flex-start' }}>
        <Image
          source={typeToIcon(type)}
          contentFit="contain"
          cachePolicy="memory"
          style={{ width: '100%', height: '70%' }}
        />
        <View style={{ marginTop: 50 }}>
          <DatePickerInput
            inputMode="start"
            value={replacementDate}
            onChange={(date) => setReplacementDate(date)}
            label="Replacement Date"
            locale="ru"
            mode="outlined"
          />
        </View>
      </View>

      <View style={{ marginBottom: 50 }}>
        <IconButton
          icon={pressed ? 'stop' : 'play'}
          mode="contained-tonal"
          size={140}
          containerColor={pressed ? colors.tertiary : colors.primary}
          iconColor={pressed ? colors.onTertiary : colors.onPrimary}
          style={{ alignSelf: 'center' }}
          animated={true}
          onPress={() => {
            setPressed((prev) => {
              prev ? stopPlay() : startPlay();
              return !prev;
            });
          }}
        />
      </View>
      <Text>{`Days from replacement: ${daysSince}`}</Text>
      <View style={{ marginBottom: 70 }}>
        <ProgressBar
          progress={parseFloat(progress.toFixed(2))}
          color={colors.primary}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: '400' },
  datePicker: {
    borderWidth: 1,
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  instrument: {
    flex: 1,
    paddingHorizontal: 16,
  },
  button: {
    borderRadius: 6,
    borderWidth: 1,
    padding: 6,
  },
});
