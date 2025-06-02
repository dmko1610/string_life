import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  IconButton,
  ProgressBar,
  Text,
  useTheme,
} from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';

import { typeToIcon } from '@/helpers/iconizator';
import { useTranslation } from '@/hooks/useTranslation';
import { KEYS } from '@/lib/i18n';
import { getInstrument, updateInstrument } from '@/services/db';

const TARGET_TIME_SECONDS = 100 * 60 * 60 * 1000;

export default function InstrumentDetails() {
  const { t, locale } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [type, setType] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [replacementDate, setReplacementDate] = useState<Date | undefined>(
    undefined
  );

  const playingRef = useRef(false);
  const playStartTimeRef = useRef<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getInstrument(id);

      if (data) {
        setType(data.type);
        setProgress(data.progress || 0);
        setReplacementDate(new Date(data.replacement_date as number));
      }
    } catch (error) {
      console.error('Failed to fetch instrument', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      const checkOngoingPlay = async () => {
        const startTime = await AsyncStorage.getItem('playStartTime');
        if (startTime) {
          playingRef.current = true;
          playStartTimeRef.current = Number(startTime);
          setPressed(true);
        }
      };

      fetchData();
      checkOngoingPlay();
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

      await updateInstrument(newProgress, id);
    }

    playStartTimeRef.current = null;
    await AsyncStorage.removeItem('playStartTime');
  };

  const handlePress = () => {
    if (pressed) stopPlay();
    else startPlay();
    setPressed(!pressed);
  };

  if (loading) {
    return (
      <SafeAreaView
        edges={['left', 'right', 'bottom', 'top']}
        style={[
          styles.instrument,
          styles.instrumenLoading,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator animating={true} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['left', 'right', 'top', 'bottom']}
      style={[styles.instrument, { backgroundColor: colors.background }]}
    >
      <IconButton
        icon={'arrow-u-right-bottom'}
        mode="contained-tonal"
        size={30}
        iconColor={colors.onPrimary}
        containerColor={colors.primary}
        animated={true}
        style={{ alignSelf: 'flex-end' }}
        onPress={() => router.back()}
      />
      <Text style={styles.header}>{type.toUpperCase()}</Text>

      <View style={styles.imageContainer}>
        <Image
          source={typeToIcon(type)}
          contentFit="contain"
          cachePolicy="memory"
          style={styles.image}
        />
        <View style={styles.datePicker}>
          <DatePickerInput
            inputMode="start"
            value={replacementDate}
            onChange={(date) => setReplacementDate(date)}
            label={t(KEYS.INSTRUMENT.REPL_LABEL)}
            locale={locale}
            mode="outlined"
          />
        </View>
      </View>

      <View style={styles.playButtonContainer}>
        <IconButton
          icon={pressed ? 'stop' : 'play'}
          mode="contained-tonal"
          size={140}
          containerColor={pressed ? colors.tertiary : colors.primary}
          iconColor={pressed ? colors.onTertiary : colors.onPrimary}
          style={styles.playButton}
          animated={true}
          onPress={handlePress}
        />
      </View>

      <Text
        style={styles.daysSinceText}
      >{`${t(KEYS.INSTRUMENT.DAYS_SINCE_LABEL)} ${daysSince}`}</Text>
      <Text>{`${Math.floor(progress / 60_000)} min / ${TARGET_TIME_SECONDS / 60_000} min`}</Text>
      <View style={styles.playtimeContainer}>
        <Text style={styles.playtimeText}>
          {t(KEYS.INSTRUMENT.PLAY_TIME_LABEL)}
        </Text>
        <Text style={styles.playtimeText}>
          {t(KEYS.INSTRUMENT.END_TIME_LABEL)}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <ProgressBar
          progress={parseFloat((progress / TARGET_TIME_SECONDS).toFixed(2))}
          color={colors.primary}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  playtimeContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  playtimeText: { fontSize: 16, marginBottom: 4 },
  daysSinceText: { fontSize: 24, marginBottom: 32 },
  header: {
    fontSize: 20,
    fontWeight: '400',
    marginTop: 2,
    marginLeft: 16,
    marginBottom: 30,
  },
  playButtonContainer: { marginBottom: 50 },
  playButton: { alignSelf: 'center' },
  progressBar: { marginBottom: 70 },
  imageContainer: { flex: 1, justifyContent: 'flex-start' },
  image: { width: '100%', height: '70%' },
  datePicker: {
    marginTop: 50,
  },
  instrument: {
    flex: 1,
    paddingHorizontal: 16,
  },
  instrumenLoading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 6,
    borderWidth: 1,
    padding: 6,
  },
});
