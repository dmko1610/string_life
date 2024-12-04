import { fireEvent, render, screen } from "@testing-library/react-native"
import React from "react"
import Dashboard from "@/app/dashboard"
import { useRouter } from "expo-router"

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}))

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

  describe("when the add button is pressed", () => {
    it("navigates to the add instrument screen", () => {
      const push = jest.fn()
      useRouter.mockReturnValue({ push })
      renderDashboard()

      const addButton = screen.getByTestId("addButton")
      fireEvent.press(addButton)

      expect(push).toHaveBeenCalledWith("/add-instrument")
    })
  })
})
