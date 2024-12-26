import React, { useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import DropDownPicker from "react-native-dropdown-picker"
import { Colors } from "@/constants/Colors"

const TITLE_TEXT = "MY GUITARS"

export default function AddInstrument() {
  const data = [
    { label: "Electro", value: "electro" },
    { label: "Bass", value: "bass" },
    { label: "Acoustic", value: "acoustic" },
    { label: "Ukulele", value: "ukulele" },
    { label: "Classic", value: "classic" },
  ]

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)

  DropDownPicker.setTheme("DARK")

  return (
    <SafeAreaView
      edges={["left", "right", "bottom", "top"]}
      style={styles.instrument}
    >
      <Text style={styles.title}>{TITLE_TEXT}</Text>

      <View style={styles.inputs}>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.dark.placeholder}
          placeholder="Guitar name"
        ></TextInput>
        <DropDownPicker
          style={styles.input}
          items={data}
          open={open}
          setOpen={setOpen}
          value={value}
          setValue={setValue}
          placeholder="Guitar type"
          placeholderStyle={{ color: Colors.dark.placeholder }}
          textStyle={{ color: Colors.dark.text, fontSize: 16 }}
          dropDownContainerStyle={{
            backgroundColor: Colors.dark.background,
            borderColor: Colors.dark.accent,
          }}
          disableBorderRadius={false}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  inputs: {
    marginTop: 75,
    flex: 1,
    gap: 20,
  },
  instrument: {
    flex: 1,
    justifyContent: "flex-start",
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
  title: {
    fontSize: 20,
    fontWeight: "400",
    color: Colors.dark.text,
    alignSelf: "flex-start",
    marginTop: 60,
    marginLeft: 16,
  },
})
