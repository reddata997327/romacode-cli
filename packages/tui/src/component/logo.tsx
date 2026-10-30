import { useTerminalDimensions } from "@opentui/solid"
import { Show } from "solid-js"
import { useTheme } from "../context/theme"

// ROMA CODE wordmark rendered with the OpenTUI block font.
// Wide terminals draw both words side by side; narrow ones stack them.
// Colors follow the active theme, same as the previous wordmark:
// first word muted, second word bright.
export function Logo() {
  const theme = useTheme()
  const dimensions = useTerminalDimensions()

  return (
    <Show
      when={dimensions().width >= 72}
      fallback={
        <box flexDirection="column">
          <ascii_font text="ROMA" font="block" color={theme.text.muted} selectable={false} />
          <ascii_font text="CODE" font="block" color={theme.text.base} selectable={false} />
        </box>
      }
    >
      <box flexDirection="row">
        <ascii_font text="ROMA" font="block" color={theme.text.muted} selectable={false} />
        <ascii_font text="CODE" font="block" color={theme.text.base} selectable={false} />
      </box>
    </Show>
  )
}
