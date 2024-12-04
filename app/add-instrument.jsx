import { useRouter } from "expo-router"
import React from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

export default function AddInstrument() {
  const router = useRouter()

  return (
    <>
      <View style={styles.instrument}></View>
      <Pressable onPress={() => router.back()}>
        <Text>Dashboard</Text>
      </Pressable>
    </>
  )
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
