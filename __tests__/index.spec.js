import { fireEvent, render, screen } from "@testing-library/react-native"
import React from "react"
import App from "@/app/index"
import { useRouter } from "expo-router"

jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
  useRouter: jest.fn(),
}))

function renderApp() {
  render(<App />)
}

describe("App", () => {
  it("displays the Instrument button", () => {
    renderApp()

    expect(screen.getByText("Instrument")).toBeTruthy()
  })

  describe("when the instrument button is pressed", () => {
    it("navigates to the instrument screen", () => {
      const navigate = jest.fn()
      useRouter.mockReturnValue({ navigate: navigate })
      renderApp()

      const instrumentButton = screen.getByText("Instrument")
      fireEvent.press(instrumentButton)

      expect(navigate).toHaveBeenCalledWith("/instrument")

      jest.resetAllMocks()
    })
  })
})
