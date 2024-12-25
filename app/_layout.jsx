import React from "react"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#151515" },
          headerTintColor: "#fff",
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
    </>
  )
}
