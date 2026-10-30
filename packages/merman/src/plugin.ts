import { Plugin } from "@romacode/plugin/tui"
import { createMermaidCodeBlockRenderer } from "./markdown.js"
import { resolveRomaCodeDiagramPalette } from "./palette.js"

export default Plugin.define({
  id: "romacode.merman",
  setup(context) {
    context.markdown.registerCodeBlockRenderer(
      "mermaid",
      createMermaidCodeBlockRenderer(context.renderer, () => ({
        colors: resolveRomaCodeDiagramPalette(context.theme, context.themeMode),
      })),
    )
  },
})
