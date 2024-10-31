import React from "react"
import { StyleSheet, View } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { ProgressBar } from "react-native-paper"

export default function Instrument() {
  return <View style={styles.instrument}></View>
}

const styles = StyleSheet.create({
  instrument: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151515",
  },
})
