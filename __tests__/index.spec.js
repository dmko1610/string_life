import React from "react"
import { render, screen } from "@testing-library/react-native"
import Index from "@/app/index.jsx"

jest.mock("expo-router", () => ({
  Link: ({ children }) => children,
}))

function renderIndex() {
  render(<Index />)
}

describe("Index", () => {
  it("displays the title", () => {
    renderIndex()

    expect(screen.getByText("MY GUITARS")).toBeTruthy()
  })

  it("displays the add button", () => {
    renderIndex()

    expect(screen.getByTestId("addButton")).toBeTruthy()
  })
})
