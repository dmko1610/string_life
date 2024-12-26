import React from "react"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Colors } from "@/constants/Colors"
import { StyleSheet, View } from "react-native"

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.dark.background },
          headerTintColor: Colors.dark.text,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-instrument"
          options={{
            headerTransparent: true,
            headerBackButtonDisplayMode: "minimal",
            headerTitle: "",
          }}
        />
      </Stack>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark.background },
})
