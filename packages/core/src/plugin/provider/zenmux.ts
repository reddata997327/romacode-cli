import { Effect } from "effect"
import { define } from "@romacode/plugin/effect/plugin"

export const ZenmuxPlugin = define({
  id: "romacode.provider.zenmux",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.provider.transform((evt) => {
      for (const item of evt.list()) {
        if (item.provider.package !== "@romacode/ai/providers/openai-compatible") continue
        if (item.provider.settings?.baseURL !== "https://zenmux.ai/api/v1") continue
        evt.update(item.provider.id, (provider) => {
          provider.headers = {
            "HTTP-Referer": "https://romacode.dev/",
            "X-Title": "romacode",
            ...provider.headers,
          }
        })
      }
    })
  }),
})
