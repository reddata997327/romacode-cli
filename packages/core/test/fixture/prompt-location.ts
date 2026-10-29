import type { FileSystem } from "@romacode/core/filesystem"
import { Bus } from "@romacode/core/bus"
import { Image } from "@romacode/core/image"
import { LocationServiceMap } from "@romacode/core/location-service-map"
import type { LocationServices } from "@romacode/core/location-services"
import { Plugin } from "@romacode/core/plugin"
import { PluginHooks } from "@romacode/core/plugin/hooks"
import { Skill } from "@romacode/core/skill"
import type { Location } from "@romacode/schema/location"
import { makeGlobalNode } from "@romacode/util/effect/app-node"
import { LayerNode } from "@romacode/util/effect/layer-node"
import { Effect, Layer, LayerMap } from "effect"

// Plain-prompt unit fixtures use virtual directories.
export const promptLocationNode = makeGlobalNode({
  service: LocationServiceMap.Service,
  layer: Layer.effect(
    LocationServiceMap.Service,
    Effect.gen(function* () {
      const bus = yield* Bus.Service
      return yield* LayerMap.make(
        (_ref: Location.Ref) =>
          LayerNode.compile(LayerNode.group([PluginHooks.node, Image.node, Skill.node, Plugin.node]), {
            replacements: [
              Bus.node.replace(Layer.succeed(Bus.Service, bus)),
              Plugin.node.replace(Layer.mock(Plugin.Service, { awaitActivation: Effect.void })),
            ],
          }) as unknown as Layer.Layer<LocationServices, FileSystem.DirectoryNotFoundError>,
      )
    }),
  ),
  deps: [Bus.node],
})
