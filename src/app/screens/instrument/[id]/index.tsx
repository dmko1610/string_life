import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  IconButton,
  ProgressBar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { typeToIcon } from '@/helpers/iconizator';
import useInstrument from '@/hooks/useInstrument';
import usePlayTimer from '@/hooks/usePlayTimer';
import { useTranslation } from '@/hooks/useTranslation';
import { KEYS } from '@/lib/i18n';

const TARGET_TIME_SECONDS = 100 * 60 * 60 * 1000;

export default function InstrumentDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { t, locale } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  const { loading, type, progress, replacementDate, saveProgress } =
    useInstrument(id);

  const { isPlaying, start, stop } = usePlayTimer();

  const daysSince = replacementDate
    ? Math.floor(
        (Date.now() - replacementDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  const handlePress = async () => {
    if (isPlaying) {
      const elapsed = await stop();
      const newProgress = progress + elapsed;
      saveProgress(newProgress);
    } else {
      start();
    }
  };

  const navigate = () => router.navigate(`/screens/instrument/${id}/edit`);

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
      edges={['bottom']}
      style={[styles.instrument, { backgroundColor: colors.background }]}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={type.toUpperCase()} />
        <Appbar.Action icon={'pencil'} size={30} onPress={navigate} />
      </Appbar.Header>

      <View style={styles.imageContainer}>
        <Image
          source={typeToIcon(type)}
          contentFit="contain"
          cachePolicy="memory"
          style={styles.image}
        />

        <Surface mode="flat" style={styles.replacementDate}>
          <Text variant="titleLarge">{`${t(KEYS.INSTRUMENT.REPL_LABEL)} : ${replacementDate.toLocaleDateString([locale], { dateStyle: 'long' })}`}</Text>
          <Text variant="titleLarge">{`${t(KEYS.INSTRUMENT.DAYS_SINCE_LABEL)} ${daysSince}`}</Text>
        </Surface>
      </View>

      <View style={styles.playButtonContainer}>
        <IconButton
          icon={isPlaying ? 'stop' : 'play'}
          mode="contained-tonal"
          size={140}
          containerColor={isPlaying ? colors.tertiary : colors.primary}
          iconColor={isPlaying ? colors.onTertiary : colors.onPrimary}
          style={styles.playButton}
          animated={true}
          onPress={handlePress}
        />
      </View>

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
  replacementDate: { padding: 16, borderRadius: 10, marginTop: 24 },
  playtimeContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  playtimeText: { fontSize: 16, marginBottom: 4 },
  playButtonContainer: { marginBottom: 50 },
  playButton: { alignSelf: 'center' },
  progressBar: { marginBottom: 70 },
  imageContainer: { flex: 1, justifyContent: 'flex-start' },
  image: { width: '100%', height: '70%' },
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
