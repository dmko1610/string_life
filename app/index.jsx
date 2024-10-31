import React from "react"
import { PaperProvider } from "react-native-paper"
import Dashboard from "./dashboard"

export default function Index() {
  return (
    <PaperProvider>
      <Dashboard />
    </PaperProvider>
  )
}
