import { render, screen } from "@testing-library/react-native"
import React from "react"
import Dashboard from "@/app/dashboard"

function renderDashboard() {
  render(<Dashboard />)
}

describe("Dashboard", () => {
  it("displays the title", () => {
    renderDashboard()

    expect(screen.getByText("MY GUITARS")).toBeTruthy()
  })

  it("displays the add button", () => {
    renderDashboard()

    expect(screen.getByTestId("addButton")).toBeTruthy()
  })
})
