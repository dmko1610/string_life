import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  DataTable,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import useInstrument from '@/hooks/useInstrument';
import { useInstrumentTable } from '@/hooks/useInstrumentTable';
import { useTranslation } from '@/hooks/useTranslation';
import { KEYS } from '@/lib/i18n';
import { MyTheme } from '@/theme';

export default function InstrumentTable() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme<MyTheme>();
  const { t, locale } = useTranslation();

  const { loading, progress, replacementDate } = useInstrument(id);
  const { daysSince, totalMinutes, hours, minutes } = useInstrumentTable(
    progress,
    replacementDate
  );

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
        <Appbar.Content title={t(KEYS.INSTRUMENT_TABLE.TITLE)} />
      </Appbar.Header>

      <View style={styles.content}>
        <Surface mode="flat" style={styles.surface}>
          <Text variant="bodyLarge" style={styles.description}>
            {t(KEYS.INSTRUMENT_TABLE.DESCRIPTION)}
          </Text>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>
                {t(KEYS.INSTRUMENT_TABLE.METRIC)}
              </DataTable.Title>
              <DataTable.Title numeric>
                {t(KEYS.INSTRUMENT_TABLE.VALUE)}
              </DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>
                {t(KEYS.INSTRUMENT_TABLE.TOTAL_MINUTES)}
              </DataTable.Cell>
              <DataTable.Cell numeric>{totalMinutes}</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                {t(KEYS.INSTRUMENT_TABLE.HOURS_AND_MINUTES)}
              </DataTable.Cell>
              <DataTable.Cell numeric>
                {hours}
                {t(KEYS.INSTRUMENT.HOURS_TEXT)}
                {minutes}
                {t(KEYS.INSTRUMENT.MINUTES_TEXT)}
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>
                {t(KEYS.INSTRUMENT_TABLE.DAYS_SINCE)}
              </DataTable.Cell>
              <DataTable.Cell numeric>{daysSince}</DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          <View style={styles.summary}>
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
