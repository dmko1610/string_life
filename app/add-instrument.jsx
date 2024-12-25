import React from "react"
import { StyleSheet, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const TITLE_TEXT = "MY GUITARS"

export default function AddInstrument() {
  return (
    <SafeAreaView
      edges={["left", "right", "bottom", "top"]}
      style={styles.instrument}
    >
      <Text style={styles.title}>{TITLE_TEXT}</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  instrument: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#151515",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "400",
    color: "#E5DBD0",
    alignSelf: "flex-start",
    marginTop: 60,
    marginLeft: 16,
  },
})
