import DateTimePicker from '@react-native-community/datetimepicker';
import { Image, ImageSource } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';

import IconCalendar from '@/assets/icons/calendar.svg';
import IconPlay from '@/assets/icons/play.svg';
import images from '@/helpers/images';

import { Instrument } from '.';

const typesToIcons: Record<string, ImageSource> = {
  electro: images.electroGuitarLarge,
  acoustic: images.acousticGuitarLarge,
  bass: images.bassGuitarLarge,
  ukulele: images.ukuleleLarge,
};

function typeToIcon(type: keyof typeof typesToIcons): ImageSource {
  return typesToIcons[type];
}

export default function InstrumentDetails({}) {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const router = useRouter();

  const [type, setType] = useState<string>('');
  const [replacementDate, setReplacementDate] = useState<Date | undefined>(
    undefined
  );

  async function fetchData() {
    const data: Instrument | null = await db.getFirstAsync(
      'SELECT * FROM stringLife WHERE id=?',
      [1]
    );

    if (data) {
      setType(data.type);
    }
  }

  useFocusEffect(() => {
    fetchData();
  });

  console.log(typeToIcon(type));

  return (
    <View style={[styles.instrument, { backgroundColor: colors.background }]}>
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

      <IconButton
        icon="play"
        mode="contained-tonal"
        size={140}
        containerColor={colors.primary}
        iconColor={colors.onPrimary}
        style={{ alignSelf: 'center', marginBottom: 100 }}
        animated={true}
        onPress={() => {}}
      />
    </View>
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
    paddingTop: 70,
  },
  button: {
    borderRadius: 6,
    borderWidth: 1,
    padding: 6,
  },
});
