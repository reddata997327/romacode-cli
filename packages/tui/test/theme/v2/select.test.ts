import { expect, test } from "bun:test"
import { selectTheme, selectThemeMode, supportsThemeMode, themeModes } from "@romacode/theme/tui"
import { getRomaCodeTheme } from "../../../src/theme"

test("selects complete light and dark themes independently", () => {
  const light = selectTheme(getRomaCodeTheme(), "light")
  const dark = selectTheme(getRomaCodeTheme(), "dark")
  expect(selectTheme(getRomaCodeTheme())).toEqual(light)
  expect(light.hue).toEqual(getRomaCodeTheme().light.hue)
  expect(dark.text).toEqual(getRomaCodeTheme().base.text)
  expect(dark.hue).toEqual(getRomaCodeTheme().dark.hue)
  expect(selectThemeMode(getRomaCodeTheme(), "dark")).toEqual({ theme: dark, mode: "dark" })
})

test("selects the available mode when the requested mode is missing", () => {
  const lightOnly = { base: getRomaCodeTheme().base, light: getRomaCodeTheme().light } as const
  const darkOnly = { base: getRomaCodeTheme().base, dark: getRomaCodeTheme().dark } as const

  expect(themeModes(lightOnly)).toEqual(["light"])
  expect(themeModes(darkOnly)).toEqual(["dark"])
  expect(supportsThemeMode(lightOnly, "light")).toBeTrue()
  expect(supportsThemeMode(lightOnly, "dark")).toBeFalse()
  expect(selectThemeMode(lightOnly, "dark")).toEqual({ theme: selectTheme(getRomaCodeTheme(), "light"), mode: "light" })
  expect(selectThemeMode(darkOnly, "light")).toEqual({ theme: selectTheme(getRomaCodeTheme(), "dark"), mode: "dark" })
})
