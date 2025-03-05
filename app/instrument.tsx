import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton, ProgressBar, useTheme } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';

import { typeToIcon } from '@/helpers/iconizator';

import { Instrument } from '.';

const TARGET_TIME_SECONDS = 360_000_000; // 100 hours

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
  const playStartTimeRef = useRef<number | null>(null);

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

  const daysSince = replacementDate
    ? Math.floor(
        (Date.now() - replacementDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  const startPlay = async () => {
    playingRef.current = true;
    const startTime = Date.now();
    playStartTimeRef.current = startTime;

    await AsyncStorage.setItem('playStartTime', String(startTime));
  };

  const stopPlay = async () => {
    if (!playingRef.current) return;

    playingRef.current = false;

    const startTime =
      playStartTimeRef.current || (await AsyncStorage.getItem('playStartTime'));

    if (startTime) {
      const elapsed = Math.floor(Date.now() - Number(startTime));
      const newProgress = progress + elapsed;

      setProgress(newProgress);

      await db.runAsync(
        'UPDATE stringLife SET progress= ? WHERE id=?',
        newProgress,
        String(id)
      );
    }

    playStartTimeRef.current = null;
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
          progress={parseFloat((progress / TARGET_TIME_SECONDS).toFixed(2))}
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
