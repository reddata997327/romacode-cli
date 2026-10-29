import { Agent } from "@romacode/core/agent"
import { AISDK } from "@romacode/core/aisdk"
import { Command } from "@romacode/core/command"
import { Config } from "@romacode/core/config"
import { Credential } from "@romacode/core/credential"
import { Database } from "@romacode/core/database/database"
import { FileAccess } from "@romacode/core/file-access"
import { LayerNodePlatform } from "@romacode/util/effect/app-node-platform"
import { AppProcess } from "@romacode/util/process"
import { LayerNode } from "@romacode/util/effect/layer-node"
import { Bus } from "@romacode/core/bus"
import { FileSystem } from "@romacode/core/filesystem"
import { FSUtil } from "@romacode/util/fs-util"
import { Form } from "@romacode/core/form"
import { Generate } from "@romacode/core/generate"
import { Integration } from "@romacode/core/integration"
import { KV } from "@romacode/core/kv"
import { Location } from "@romacode/core/location"
import { Mcp } from "@romacode/core/mcp/index"
import { Model } from "@romacode/core/model"
import { Npm } from "@romacode/util/npm"
import { Plugin } from "@romacode/core/plugin"
import { PluginHooks } from "@romacode/core/plugin/hooks"
import { Provider } from "@romacode/core/provider"
import { Session } from "@romacode/core/session"
import { InstructionEntry } from "@romacode/core/session/instruction-entry"
import { PersistentPty } from "@romacode/core/persistent-pty"
import { LocationServiceMap } from "@romacode/core/location-service-map"
import { AppNodeBuilder } from "@romacode/core/effect/app-node-builder"
import { Permission } from "@romacode/core/permission"
import { Reference } from "@romacode/core/reference"
import { Rpc } from "@romacode/core/rpc"
import { Skill } from "@romacode/core/skill"
import { SkillDiscovery } from "@romacode/core/skill/discovery"
import { Watcher } from "@romacode/core/filesystem/watcher"
import { Tool } from "@romacode/core/tool"
import { Vcs } from "@romacode/core/vcs"
import { WebSearch } from "@romacode/core/websearch"
import { Worktree } from "@romacode/core/worktree"
import { WorktreeStrategies } from "@romacode/core/worktree/strategies"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"
import { emptyMcpLayer } from "../fixture/mcp"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: (name) => Effect.succeed({ directory: "", name }),
    resolve: (name) => Effect.succeed({ directory: "", name }),
    check: () => Effect.succeed(false),
    update: (name) => Effect.succeed({ directory: "", name }),
    which: () => Effect.undefined,
  }),
)

const generateLayer = Layer.succeed(
  Generate.Service,
  Generate.Service.of({
    text: () => Effect.succeed(""),
    image: () => Effect.die("unused"),
    decisions: () => Effect.die("unused"),
  }),
)

const configLayer = Config.testLayer()

const permissionLayer = Layer.succeed(
  Permission.Service,
  Permission.Service.of({
    close: Effect.void,
    ask: (input) => Effect.succeed({ id: input.id ?? Permission.ID.create(), effect: "ask" }),
    assert: () => Effect.void,
    assertNotDenied: () => Effect.void,
    reply: () => Effect.void,
    get: () => Effect.succeed(undefined),
    forSession: () => Effect.succeed([]),
    list: () => Effect.succeed([]),
  }),
)

export const makePluginTestLayer = (permission = permissionLayer) =>
  AppNodeBuilder.build(
    LayerNode.group([
      AppProcess.node,
      FileSystem.node,
      FSUtil.node,
      Location.node,
      Npm.node,
      Credential.node,
      Config.node,
      Database.node,
      FileAccess.node,
      Bus.node,
      Form.node,
      Generate.node,
      LayerNodePlatform.httpClient,
      Plugin.node,
      Agent.node,
      AISDK.node,
      Provider.node,
      Model.node,
      Command.node,
      Integration.node,
      KV.node,
      Mcp.node,
      Session.node,
      InstructionEntry.node,
      PersistentPty.node,
      LocationServiceMap.node,
      Permission.node,
      PluginHooks.node,
      Reference.node,
      Rpc.node,
      Skill.node,
      SkillDiscovery.node,
      Tool.node,
      Vcs.node,
      Watcher.node,
      WebSearch.node,
      Worktree.node,
      WorktreeStrategies.node,
    ]),
    [
      Location.node.replace(tempLocationLayer),
      Npm.node.replace(npmLayer),
      Config.node.replace(configLayer),
      Mcp.node.replace(emptyMcpLayer),
      Generate.node.replace(generateLayer),
      Permission.node.replace(permission),
    ],
  ).pipe(Layer.provideMerge(configLayer))

export const PluginTestLayer = makePluginTestLayer()
