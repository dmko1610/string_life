import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import React from "react"

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
            headerBackVisible: true,
            headerTransparent: true,
          }}
        />
      </Stack>
    </>
  )
}
