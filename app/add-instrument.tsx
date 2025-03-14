import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  IconButton,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';

const TITLE_TEXT = 'ADD INSTRUMENT';
const SAVE_BUTTON_TEXT = 'Save';
const NAME_PLACEHOLDER = 'Guitar name';

const data: { value: string; label: string }[] = [
  { value: 'electro', label: 'Electro' },
  { value: 'bass', label: 'Bass' },
  { value: 'acoustic', label: 'Acoustic' },
  { value: 'ukulele', label: 'Ukulele' },
];

const ADD_INSTRUMENT_QUERY =
  'INSERT INTO stringLife (name, type, replacement_date, progress) VALUES (?, ?, ?, ?)';

export default function AddInstrument() {
  const db = useSQLiteContext();
  const { colors } = useTheme();

  const [type, setType] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [replacementDate, setReplacementDate] = useState<Date | undefined>(
    undefined
  );

  const isDisabled = !name || !type || !replacementDate;

  const saveInstrument = async () => {
    try {
      const timestamp = replacementDate ? replacementDate.getTime() : null;

      await db.runAsync(ADD_INSTRUMENT_QUERY, name, type, timestamp, 0);

      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom', 'top']}
      style={[styles.instrument, { backgroundColor: colors.background }]}
    >
      <View style={{ justifyContent: 'space-between' }}>
        <IconButton
          icon={'arrow-left'}
          style={{ left: -16 }}
          onPress={() => router.back()}
        />
        <Text style={styles.title}>{TITLE_TEXT}</Text>
      </View>
      <View style={styles.inputs}>
        <SegmentedButtons
          value={type ?? ''}
          onValueChange={setType}
          buttons={data}
          theme={{
            colors: {
              secondaryContainer: colors.primary,
              onSecondaryContainer: colors.onPrimary,
            },
          }}
        />
        <TextInput
          mode="outlined"
          label={NAME_PLACEHOLDER}
          value={name}
          onChangeText={setName}
        />
        <View style={styles.datePicker}>
          <DatePickerInput
            locale="ru"
            label="Date of replacement"
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
        disabled={!type || !name || !replacementDate}
        onPress={saveInstrument}
      >
        {SAVE_BUTTON_TEXT}
      </Button>
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
    marginTop: 75,
    justifyContent: 'flex-start',
  },
  instrument: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    marginTop: 10,
    marginLeft: 16,
  },
});
