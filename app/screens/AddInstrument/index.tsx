import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Appbar,
  Button,
  Portal,
  SegmentedButtons,
  Snackbar,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from '@/hooks/useTranslation';
import { KEYS } from '@/lib/i18n';
import { addInstrument } from '@/services/db';

export default function AddInstrument() {
  const { t, locale } = useTranslation();
  const { colors } = useTheme();

  const [type, setType] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [replacementDate, setReplacementDate] = useState<Date | undefined>(
    undefined
  );
  const [error, setError] = useState('');

  const data: { value: string; label: string }[] = [
    { value: 'electro', label: t(KEYS.LABELS.electro) },
    { value: 'bass', label: t(KEYS.LABELS.bass) },
    { value: 'acoustic', label: t(KEYS.LABELS.acoustic) },
    { value: 'ukulele', label: t(KEYS.LABELS.ukulele) },
  ];

  const isDisabled = !name || !type || !replacementDate;

  const saveInstrument = useCallback(async () => {
    try {
      const timestamp = replacementDate ? replacementDate.getTime() : null;

      await addInstrument(name, type, timestamp, 0);

      router.back();
    } catch (error) {
      console.error(error);
      setError(t(KEYS.ERRORS.saveInstrumentFailed));
    }
  }, [name, type, replacementDate]);

  const buttonTheme = useMemo(
    () => ({
      colors: {
        secondaryContainer: colors.primary,
        onSecondaryContainer: colors.onPrimary,
      },
    }),
    [colors]
  );

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.instrument, { backgroundColor: colors.background }]}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t(KEYS.ADD_INSTRUMENT.TITLE)} />
      </Appbar.Header>
      <View style={styles.inputs}>
        <SegmentedButtons
          value={type ?? ''}
          onValueChange={setType}
          buttons={data}
          theme={buttonTheme}
        />
        <TextInput
          mode="outlined"
          label={t(KEYS.ADD_INSTRUMENT.PLACEHOLDER)}
          value={name}
          onChangeText={setName}
        />
        <View style={styles.datePicker}>
          <DatePickerInput
            locale={locale}
            label={t(KEYS.ADD_INSTRUMENT.REPL_LABEL)}
            value={replacementDate}
            onChange={(date) => setReplacementDate(date)}
            inputMode="start"
            mode="outlined"
          />
        </View>
      </View>
      <Button
        mode="contained"
        style={[
          styles.buttonContainer,
          {
            backgroundColor: isDisabled ? colors.secondary : colors.primary,
          },
        ]}
        labelStyle={{
          fontSize: 20,
          color: colors.onPrimary,
        }}
        disabled={isDisabled}
        onPress={saveInstrument}
      >
        {t(KEYS.ADD_INSTRUMENT.SAVE_BUTTON)}
      </Button>
      <Portal>
        <Snackbar
          visible={!!error}
          onDismiss={() => setError('')}
          style={styles.snackbar}
        >
          {error}
        </Snackbar>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  datePicker: { marginTop: 20 },
  buttonContainer: {
    borderRadius: 10,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  inputs: {
    flex: 1,
    gap: 20,
    marginTop: 40,
    justifyContent: 'flex-start',
  },
  instrument: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  snackbar: {
    marginBottom: 60,
  },
});
