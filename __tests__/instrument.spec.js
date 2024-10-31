import Instrument from "@/app/instrument"
import { render, screen } from "@testing-library/react-native"
import React from "react"

function renderInstrument() {
  render(<Instrument />)
}

describe("Instrument", () => {
  it("displays the screen", () => {
    renderInstrument()

    expect(screen.getByText("Instrument Page")).toBeTruthy()
  })
})
