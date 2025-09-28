import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

import useInstrument from '@/hooks/useInstrument';
import {
  HOURS_IN_MS,
  MINUTES_IN_MS,
  useInstrumentGraph,
} from '@/hooks/useInstrumentGraph';
import { useTranslation } from '@/hooks/useTranslation';
import { KEYS } from '@/lib/i18n';
import { MyTheme } from '@/theme';

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

  const { points, maxDay, maxHours } = useInstrumentGraph(
    progress,
    replacementDate
  );

  const availableWidth = SCREEN_WIDTH - CONTENT_HORIZONTAL_PADDING * 2;
  const chartWidth = availableWidth - (LEFT_PADDING + RIGHT_PADDING);
  const verticalSpace = CHART_HEIGHT - (TOP_PADDING + BOTTOM_PADDING);

  const plottedPoints = useMemo(() => {
    return points.map((point) => {
      const x = LEFT_PADDING + (point.day / maxDay) * chartWidth;
      const y =
        CHART_HEIGHT -
        BOTTOM_PADDING -
        (point.hours / maxHours) * verticalSpace;

      return { x, y };
    });
  }, [chartWidth, maxDay, maxHours, points, verticalSpace]);

  const polylinePoints = plottedPoints
    .map((point) => `${point.x},${point.y}`)
    .join(' ');

  const lastPoint = plottedPoints.at(plottedPoints.length - 1);

  const dayTicks = useMemo(() => {
    const mid = Math.round(maxDay / 2);
    const unique = Array.from(new Set([0, mid, maxDay]));

    return unique.map((day) => ({
      label: `${day}`,
      x: LEFT_PADDING + (day / maxDay) * chartWidth,
    }));
  }, [chartWidth, maxDay]);

  const hourTicks = useMemo(() => {
    const first = 0;
    const mid = Number((maxHours / 2).toFixed(1));
    const max = Number(maxHours.toFixed(1));
    const unique = Array.from(new Set([first, mid, max]));

    return unique.map((hours) => ({
      label: `${hours}`,
      y: CHART_HEIGHT - BOTTOM_PADDING - (hours / maxHours) * verticalSpace,
    }));
  }, [maxHours, verticalSpace]);

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

            {dayTicks.map((tick) => (
              <SvgText
                key={`day-${tick.label}`}
                x={tick.x}
                y={CHART_HEIGHT - BOTTOM_PADDING + 18}
                fontSize={12}
                fill={colors.onSurfaceVariant}
                textAnchor="middle"
              >
                {tick.label}
              </SvgText>
            ))}

            {hourTicks.map((tick) => (
              <SvgText
                key={`hour-${tick.label}`}
                x={LEFT_PADDING - 8}
                y={tick.y + 4}
                fontSize={12}
                fill={colors.onSurfaceVariant}
                textAnchor="end"
              >
                {tick.label}
              </SvgText>
            ))}

            <SvgText
              x={LEFT_PADDING + chartWidth / 2}
              y={CHART_HEIGHT - 6}
              fontSize={13}
              fill={colors.onSurface}
              textAnchor="middle"
            >
              {t(KEYS.INSTRUMENT_GRAPH.DAYS_AXIS)}
            </SvgText>
            <SvgText
              x={14}
              y={TOP_PADDING + verticalSpace / 2}
              fontSize={13}
              fill={colors.onSurface}
              rotation={-90}
              origin={`14,${TOP_PADDING + verticalSpace / 2}`}
            >
              {t(KEYS.INSTRUMENT_GRAPH.HOURS_AXIS)}
            </SvgText>

            <Polyline
              points={polylinePoints}
              fill="none"
              stroke={colors.primary}
              strokeWidth={1}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {lastPoint ? (
              <Circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r={6}
                fill={colors.primary}
              />
            ) : null}
          </Svg>

          <View style={styles.summary}>
            <Text variant="titleMedium" style={styles.summaryText}>
              {t(KEYS.INSTRUMENT.PLAYTIME_TEXT)}
              {Math.floor(progress / HOURS_IN_MS)}
              {t(KEYS.INSTRUMENT.HOURS_TEXT)}
              {Math.floor((progress % HOURS_IN_MS) / MINUTES_IN_MS)}
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
