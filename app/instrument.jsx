import React from "react"
import { StyleSheet, View } from "react-native"

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
