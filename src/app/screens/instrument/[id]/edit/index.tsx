import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Button,
  HelperText,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';

import useInstrument from '@/hooks/useInstrument';
import { useTranslation } from '@/hooks/useTranslation';
import { KEYS } from '@/lib/i18n';

export default function InstrumentEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { t, locale } = useTranslation();

  const { loading, replacementDate, progress, editInstrument } =
    useInstrument(id);

  const [date, setDate] = useState<Date>(null);
  const [progressInput, setProgressInput] = useState('');
  const [showHelper, setShowHelper] = useState(false);

  const isDisabled = !date || !progressInput;

  useEffect(() => {
    if (!loading) {
      setDate(replacementDate);
      setProgressInput(Math.floor(progress / 60_000).toString());
    }
  }, [loading, replacementDate, progress]);

  const handleChangeProgress = (text: string) => {
    const num = parseInt(text || '0', 10);
    const clamped = Math.min(num, 6000);

    setProgressInput(clamped.toString());
    setShowHelper(num > 6000);
  };

  const handleSaveInstrument = () => {
    editInstrument(Number(progressInput) * 60_000, date);
    router.navigate(`/screens/instrument/${id}`);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
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
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t(KEYS.EDIT_INSTRUMENT.TITLE)} />
      </Appbar.Header>

      <View style={styles.inputs}>
        <View>
          <DatePickerInput
            label={t(KEYS.EDIT_INSTRUMENT.REPL_LABEL)}
            value={date}
            onChange={setDate}
            locale={locale}
            mode="outlined"
            inputMode="start"
          />
        </View>

        <View>
          <TextInput
            label={t(KEYS.EDIT_INSTRUMENT.PROGRESS_LABEL)}
            value={progressInput}
            onChangeText={handleChangeProgress}
            keyboardType="numeric"
            mode="outlined"
            error={showHelper}
          />
          <HelperText type="error" visible={showHelper} padding="normal">
            {t(KEYS.EDIT_INSTRUMENT.PROGRESS_MAX_HELPER_TEXT)}
          </HelperText>

          <Button
            onPress={handleSaveInstrument}
            mode="elevated"
            labelStyle={[styles.label, { color: colors.onPrimary }]}
            style={[
              styles.buttonContainer,
              {
                backgroundColor: isDisabled ? colors.secondary : colors.primary,
              },
            ]}
          >
            {t(KEYS.EDIT_INSTRUMENT.SAVE_BUTTON)}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center' },
  container: { flex: 1, justifyContent: 'flex-start', paddingHorizontal: 16 },
  inputs: { flex: 1, justifyContent: 'flex-start', gap: 40, marginTop: 40 },
  buttonContainer: {
    borderRadius: 10,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  label: {
    fontSize: 20,
  },
});
