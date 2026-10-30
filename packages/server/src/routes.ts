import { Database } from "@romacode/core/database/database"
import { V1Migration } from "@romacode/core/database/v1-migration"
import { App } from "@romacode/core/app"
import { LayerNode } from "@romacode/util/effect/layer-node"
import { Node } from "@romacode/util/effect/app-node"
import { httpClient } from "@romacode/util/effect/app-node-platform"
import { AppNodeBuilder } from "@romacode/core/effect/app-node-builder"
import { Bus } from "@romacode/core/bus"
import { EventLogger } from "@romacode/core/event-logger"
import { FileSystemSearch } from "@romacode/core/filesystem/search"
import { Credential } from "@romacode/core/credential"
import { Config } from "@romacode/core/config"
import { PtyTicket } from "@romacode/core/pty/ticket"
import { PersistentPty } from "@romacode/core/persistent-pty"
import { Project } from "@romacode/core/project"
import { Worktree } from "@romacode/core/worktree"
import { Session } from "@romacode/core/session"
import { Instance } from "@romacode/core/instance/service"
import { SessionTransfer } from "@romacode/core/session/transfer"
import { InstructionEntry } from "@romacode/core/session/instruction-entry"
import { ShellSelect } from "@romacode/core/shell/select"
import { Job } from "@romacode/core/job"
import { Mcp } from "@romacode/core/mcp/index"
import { Global } from "@romacode/util/global"
import { FSUtil } from "@romacode/util/fs-util"
import { InstructionDiscovery } from "@romacode/core/instruction-discovery"
import { LocationServiceMap } from "@romacode/core/location-service-map"
import { LocationActivity } from "@romacode/core/location-activity"
import { ModelsDev } from "@romacode/core/models-dev"
import { SessionRestart } from "@romacode/core/session/execution/restart"
import { PluginUpdate } from "@romacode/core/plugin/update"
import { SdkPlugins } from "@romacode/core/plugin/sdk"
import { WellKnown } from "@romacode/core/wellknown"
import { Workspace } from "@romacode/core/workspace"
import { Watcher } from "@romacode/core/filesystem/watcher"
import { FileWatch } from "@romacode/core/filesystem/file-watch"
import { HttpRouter } from "effect/http"
import { HttpApiBuilder } from "effect/http-api"
import { Context, Effect, Layer } from "effect"
import { Api } from "./api"
import { CorsConfig } from "./cors"
import { handlers } from "./handlers"
import { schemaErrorLayer } from "./middleware/schema-error"
import { ServerPairing } from "./pairing"
import { layer } from "./location"
import { formLocationLayer } from "./middleware/form-location"
import { sessionLocationLayer } from "./middleware/session-location"
import { ServerInfo } from "./server-info"
import type { ServerOptions } from "./options"

const applicationServiceNodes = [
  Global.node,
  FSUtil.node,
  Database.node,
  Bus.node,
  EventLogger.node,
  httpClient,
  Job.node,
  Project.node,
  Project.sweepNode,
  Worktree.node,
  Session.node,
  Instance.node,
  SessionTransfer.node,
  InstructionEntry.node,
  SdkPlugins.node,
  PluginUpdate.node,
  PtyTicket.node,
  PersistentPty.node,
  Credential.node,
  WellKnown.node,
  ServerPairing.node,
  LocationServiceMap.node,
  LocationActivity.node,
  SessionRestart.node,
  Workspace.node,
  FileWatch.node,
] as const
const applicationServices = LayerNode.group(applicationServiceNodes)

export function createRoutes(
  options: ServerOptions = {},
  serviceURLs: () => ReadonlyArray<string> = () => [],
  overrides: LayerNode.Replacements = [],
) {
  return makeRoutes(options, serviceURLs, overrides)
}

type InstanceNode = (
  replacements: () => LayerNode.Replacements,
) => LayerNode.Provider<Instance.Service, never, typeof Node.tags.values.global>

export function createEmbeddedRoutes(
  options: ServerOptions = {},
  overrides: LayerNode.Replacements = [],
  instances?: InstanceNode,
) {
  return makeRoutes(options, () => [], overrides, instances)
}

function makeRoutes(
  options: ServerOptions,
  serviceURLs: () => ReadonlyArray<string>,
  // Runtime-profile replacements (e.g. workerd) applied after the standard set, so later entries win.
  overrides: LayerNode.Replacements,
  instances?: InstanceNode,
) {
  const standard: LayerNode.Replacements = [
    Database.node.replace(Database.configured(options.database)),
    PersistentPty.node.replace(PersistentPty.configured(options.pty)),
    Bus.node.replace(Bus.configured({ persist: options.events?.persist })),
    App.node.replace(App.configured(options.app)),
    ModelsDev.node.replace(ModelsDev.configured(options.models)),
    Watcher.node.replace(Watcher.configured({ enabled: options.fs?.filewatcher })),
    FileWatch.node.replace(FileWatch.configured({ enabled: options.fs?.filewatcher })),
    FileSystemSearch.node.replace(FileSystemSearch.configured({ fff: options.fs?.fff })),
    Global.node.replace(Global.layerWith(options.config?.directory ? { config: options.config.directory } : {})),
    Config.node.replace(
      Config.configured({
        project: options.config?.project,
        claude: options.config?.claude,
        file: options.config?.file,
        content: options.config?.content,
      }),
    ),
    InstructionDiscovery.node.replace(InstructionDiscovery.configured({ project: options.config?.project })),
    ShellSelect.node.replace(ShellSelect.configured({ gitbash: options.windows?.gitbash })),
    Mcp.node.replace(
      Mcp.configured({
        clientInfo: {
          name: "romacode",
          version: options.app?.version ?? "unknown",
        },
      }),
    ),
  ]
  const build = (overrides: LayerNode.Replacements) => {
    const replacements: LayerNode.Replacements = [
      ...standard,
      // Private instances resolve this list lazily so they inherit the complete host graph, including the selector.
      ...(instances ? [Instance.node.replace(instances(() => replacements))] : []),
      ...overrides,
    ]
    return AppNodeBuilder.build(applicationServices, replacements)
  }
  const serviceLayer = options.simulation
    ? Layer.unwrap(
        Effect.gen(function* () {
          const { simulationReplacements } = yield* Effect.promise(() => import("@romacode/simulation/backend"))
          const simulation = yield* simulationReplacements({ version: App.make(options.app).version })
          return build([...overrides, ...simulation])
        }),
      )
    : build(overrides)
  return serviceLayer.pipe(
    Layer.flatMap((context) => {
      const services = Layer.succeedContext(context)
      const requestServices = Layer.merge(
        Layer.succeedContext(
          Context.pick(
            Database.Service,
            Credential.Service,
            PluginUpdate.Service,
            Project.Service,
            WellKnown.Service,
          )(context),
        ),
        ServerInfo.layer(serviceURLs, Context.get(context, Global.Service).tmp, options.app),
      )
      const api = HttpApiBuilder.layer(Api, { openapiPath: "/openapi.json" }).pipe(
        Layer.provide(handlers.pipe(Layer.provide(services), Layer.provide(Layer.succeed(CorsConfig, options)))),
        Layer.provide(formLocationLayer),
        Layer.provide(sessionLocationLayer),
        Layer.provide(layer),
        Layer.provide(schemaErrorLayer),
        HttpRouter.provideRequest(requestServices),
        Layer.provideMerge(services),
        Layer.provideMerge(HttpRouter.layer),
      )
      return Layer.merge(api, V1Migration.layer.pipe(Layer.provide(services)))
    }),
  )
}
