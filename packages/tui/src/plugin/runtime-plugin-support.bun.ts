import { ensurePluginRuntime, provides } from "@romacode/plugin/runtime"
import { Plugin, PluginContextProvider, usePlugin } from "@romacode/plugin/tui"
import { ensureRuntimePluginSupport } from "@opentui/solid/runtime-plugin-support/configure"

ensurePluginRuntime()
ensureRuntimePluginSupport({
  additional: {
    "@romacode/plugin/tui": { Plugin, PluginContextProvider, usePlugin },
  },
  preserve: provides,
})
