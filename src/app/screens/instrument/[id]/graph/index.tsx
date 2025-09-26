import { useLocalSearchParams, useRouter } from 'expo-router';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Line } from 'react-native-svg';

import useInstrument from '@/hooks/useInstrument';
import { useTranslation } from '@/hooks/useTranslation';
import { KEYS } from '@/lib/i18n';
import { MyTheme } from '@/theme';

const HOURS = 60 * 60 * 1000;
const MINUTES = 60 * 1000;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_HORIZONTAL_PADDING = 16;
const CHART_HEIGHT = 260;
const LEFT_PADDING = 48;
const RIGHT_PADDING = 24;
const TOP_PADDING = 24;
const BOTTOM_PADDING = 40;

export default function InstrumentGraph() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme<MyTheme>();
  const { t, locale } = useTranslation();

  const { loading, progress, replacementDate } = useInstrument(id);

  const availableWidth = SCREEN_WIDTH - CONTENT_HORIZONTAL_PADDING * 2;
  const chartWidth = availableWidth - (LEFT_PADDING + RIGHT_PADDING);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator animating={true} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t(KEYS.INSTRUMENT_GRAPH.TITLE)} />
      </Appbar.Header>

      <View style={styles.content}>
        <Surface mode="flat" style={styles.surface}>
          <Text variant="bodyLarge" style={styles.description}>
            {t(KEYS.INSTRUMENT_GRAPH.DESCRIPTION)}
          </Text>

          <Svg height={CHART_HEIGHT} width={availableWidth}>
            <Line
              x1={LEFT_PADDING}
              y1={CHART_HEIGHT - BOTTOM_PADDING}
              x2={LEFT_PADDING + chartWidth}
              y2={CHART_HEIGHT - BOTTOM_PADDING}
              stroke={colors.outlineVariant}
              strokeWidth={1}
            />

            <Line
              x1={LEFT_PADDING}
              x2={LEFT_PADDING}
              y1={TOP_PADDING}
              y2={CHART_HEIGHT - BOTTOM_PADDING}
              stroke={colors.outlineVariant}
              strokeWidth={1}
            />
          </Svg>

          <View style={styles.summary}>
            <Text variant="titleMedium" style={styles.summaryText}>
              {t(KEYS.INSTRUMENT.PLAYTIME_TEXT)}
              {Math.floor(progress / HOURS)}
              {t(KEYS.INSTRUMENT.HOURS_TEXT)}
              {Math.floor((progress % HOURS) / MINUTES)}
              {t(KEYS.INSTRUMENT.MINUTES_TEXT)}
            </Text>
            <Text variant="bodyMedium" style={styles.summaryText}>
              {t(KEYS.INSTRUMENT.REPL_LABEL)}
              {': '}
              {replacementDate.toLocaleDateString([locale], {
                dateStyle: 'long',
              })}
            </Text>
          </View>
        </Surface>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  surface: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  description: {
    marginBottom: 16,
  },
  summary: {
    marginTop: 16,
    gap: 4,
  },
  summaryText: {
    textAlign: 'center',
  },
});
