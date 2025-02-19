import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';

const TITLE_TEXT = 'MY GUITARS';
const SAVE_BUTTON_TEXT = 'Save';
const TYPE_PLACEHOLDER = 'Guitar type';
const NAME_PLACEHOLDER = 'Guitar name';

const data = Object.freeze([
  { label: 'Electro', value: 'electro' },
  { label: 'Bass', value: 'bass' },
  { label: 'Acoustic', value: 'acoustic' },
  { label: 'Ukulele', value: 'ukulele' },
]);

export default function AddInstrument() {
  const db = useSQLiteContext();

  DropDownPicker.setTheme('DARK');

  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null);
  const [name, setName] = useState(null);

  const isAddButtonDisabled = !name || !type;

  const saveInstrument = async () => {
    try {
      await db.runAsync(
        'INSERT INTO stringLife (name, type, replacement_date, progress) VALUES (?, ?, ?, ?)',
        name,
        type,
        1,
        1
      );

      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom', 'top']} style={styles.instrument}>
      <Text style={styles.title}>{TITLE_TEXT}</Text>
      <View style={styles.inputs}>
        <TextInput
          placeholderTextColor={Colors.dark.placeholder}
          placeholder={NAME_PLACEHOLDER}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <DropDownPicker
          items={data}
          open={open}
          value={type}
          setOpen={setOpen}
          setValue={setType}
          placeholder={TYPE_PLACEHOLDER}
          placeholderStyle={styles.placeholder}
          disableBorderRadius={false}
          style={styles.input}
          textStyle={styles.textStyle}
          dropDownContainerStyle={styles.dropdownStyle}
        />
      </View>

      <Pressable style={styles.buttonContainer} onPress={saveInstrument} disabled={!name || !type}>
        {({ pressed }) => (
          <LinearGradient
            colors={
              isAddButtonDisabled
                ? ['#827A72', '#5c554f']
                : pressed
                  ? ['#AC712B', '#56340C']
                  : ['#D68424', '#6E3619']
            }
            style={styles.gradient}
            end={{ x: 0.6, y: 1.5 }}
            locations={[0.1, 1]}
          >
            <Text style={styles.buttonText}>{SAVE_BUTTON_TEXT}</Text>
          </LinearGradient>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: { marginBottom: 60 },
  buttonText: {
    color: Colors.dark.text,
    fontSize: 20,
    textAlign: 'center',
  },
  dropdownStyle: {
    backgroundColor: Colors.dark.background,
    borderColor: Colors.dark.accent,
  },
  textStyle: { color: Colors.dark.text, fontSize: 16 },
  gradient: {
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputs: {
    marginTop: 75,
    flex: 1,
    gap: 20,
  },
  instrument: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 16,
  },
  input: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 0.5,
    color: Colors.dark.text,
    borderColor: Colors.dark.accent,
    backgroundColor: Colors.dark.background,
    fontSize: 16,
  },
  placeholder: { color: Colors.dark.placeholder },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: Colors.dark.text,
    alignSelf: 'flex-start',
    marginTop: 60,
    marginLeft: 16,
  },
});
