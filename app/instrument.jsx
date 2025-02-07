import { Colors } from "@/constants/Colors"
import { useFocusEffect } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import React, { useState } from "react"
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native"
import IconGuitar from '@/assets/icons/guitar.svg'
import IconCalendar from '@/assets/icons/calendar.svg'
import { Image } from "expo-image"
import images from "@/helpers/images"
import DateTimePicker from '@react-native-community/datetimepicker'


export default function Instrument() {
  const db = useSQLiteContext()

  const [type, setType] = useState('')

  async function fetchData() {
    const data = await db.getFirstAsync(
      "SELECT * FROM stringLife WHERE id=?",
      [1],
    )

    setType(data.type)
  }

  useFocusEffect(() => {
    fetchData()
  })

  return (
    <View style={styles.instrument}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
        <Text style={styles.header}>{type.toUpperCase()}</Text>
        <Pressable style={styles.button}>
          <IconGuitar />
        </Pressable>
      </View>

      <View style={{ flex: 1, marginTop: 20 }}>
        <Image source={images.acousticGuitarLarge} width="100%" height="50%" contentFit="contain" />
      </View>
      <View >
        <Text style={styles.dateText}>Replacement Date</Text>
        <View style={styles.datePicker}>
          <IconCalendar />
          <DateTimePicker
            value={new Date(1598051730000)}
            mode="date"
            style={{}}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: { color: Colors.dark.text, fontSize: 20, fontWeight: "400" },
  dateText: { color: Colors.dark.text },
  datePicker: {
    borderWidth: 1,
    paddingVertical: 15,
    borderColor: '#6E471E',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  instrument: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 70,
    backgroundColor: "#151515",
  },
  button: {
    borderRadius: 6,
    borderColor: "#BCA083",
    borderWidth: 1,
    padding: 6
  }
})
