import { NodeFileSystem } from "@effect/platform-node"
import { compile, emitEffectImported, emitEffectShape, emitPromise, write } from "@romacode/httpapi-codegen"
import { ClientApi, effectOmitEndpoints, groupNames, promiseOmitEndpoints } from "@romacode/protocol/client"
import { Agent } from "@romacode/schema/agent"
import { Command } from "@romacode/schema/command"
import { Config } from "@romacode/schema/config"
import { Credential } from "@romacode/schema/credential"
import { Event } from "@romacode/schema/event"
import { EventLog } from "@romacode/schema/event-log"
import { FileDiff } from "@romacode/schema/file-diff"
import { FileSystem } from "@romacode/schema/filesystem"
import { Form } from "@romacode/schema/form"
import { Generate } from "@romacode/schema/generate"
import { Instruction } from "@romacode/schema/instruction"
import { InstructionEntry } from "@romacode/schema/instruction-entry"
import { Integration } from "@romacode/schema/integration"
import { Location } from "@romacode/schema/location"
import { Mcp } from "@romacode/schema/mcp"
import { Model } from "@romacode/schema/model"
import { Money } from "@romacode/schema/money"
import { Permission } from "@romacode/schema/permission"
import { PermissionSaved } from "@romacode/schema/permission-saved"
import { Plugin } from "@romacode/schema/plugin"
import { Project } from "@romacode/schema/project"
import { Worktree } from "@romacode/schema/worktree"
import { AgentAttachment, FileAttachment, Prompt, PromptMention } from "@romacode/schema/prompt"
import { PromptInput } from "@romacode/schema/prompt-input"
import { Provider } from "@romacode/schema/provider"
import { Pty } from "@romacode/schema/pty"
import { PtyTicket } from "@romacode/schema/pty-ticket"
import { Question } from "@romacode/schema/question"
import { Reference } from "@romacode/schema/reference"
import { AbsolutePath, RelativePath } from "@romacode/schema/schema"
import { Session } from "@romacode/schema/session"
import { SessionMessage } from "@romacode/schema/session-message"
import { SessionInbox } from "@romacode/schema/session-inbox"
import { Shell } from "@romacode/schema/shell"
import { Skill } from "@romacode/schema/skill"
import { Snapshot } from "@romacode/schema/snapshot"
import { UsageLimits } from "@romacode/schema/usage-limits"
import { Vcs } from "@romacode/schema/vcs"
import { WebSearch } from "@romacode/schema/websearch"
import { Workspace } from "@romacode/schema/workspace"
import { Effect, Schema } from "effect"
import { fileURLToPath } from "url"

const promiseContract = compile(ClientApi, { groupNames, omitEndpoints: promiseOmitEndpoints })
const effectContract = compile(ClientApi, { groupNames, omitEndpoints: effectOmitEndpoints })
const effectTypeReferences = [
  ...namespaceTypes("Agent", "@romacode/schema/agent", Agent),
  ...namespaceTypes("Command", "@romacode/schema/command", Command),
  ...namespaceTypes("Config", "@romacode/schema/config", Config),
  ...namespaceTypes("Credential", "@romacode/schema/credential", Credential),
  ...namespaceTypes("Event", "@romacode/schema/event", Event),
  ...namespaceTypes("EventLog", "@romacode/schema/event-log", EventLog),
  ...namespaceTypes("FileDiff", "@romacode/schema/file-diff", FileDiff),
  ...namespaceTypes("FileSystem", "@romacode/schema/filesystem", FileSystem),
  ...namespaceTypes("Form", "@romacode/schema/form", Form),
  ...namespaceTypes("Generate", "@romacode/schema/generate", Generate),
  ...namespaceTypes("Instruction", "@romacode/schema/instruction", Instruction),
  ...namespaceTypes("InstructionEntry", "@romacode/schema/instruction-entry", InstructionEntry),
  ...namespaceTypes("Integration", "@romacode/schema/integration", Integration),
  typeReference("Location.PublicRef", "@romacode/schema/location", Location.PublicRef),
  typeReference("Location.PublicInfo", "@romacode/schema/location", Location.PublicInfo),
  ...namespaceTypes("Mcp", "@romacode/schema/mcp", Mcp),
  ...namespaceTypes("Model", "@romacode/schema/model", Model),
  ...namespaceTypes("Money", "@romacode/schema/money", Money),
  ...namespaceTypes("Permission", "@romacode/schema/permission", Permission),
  ...namespaceTypes("PermissionSaved", "@romacode/schema/permission-saved", PermissionSaved),
  ...namespaceTypes("Plugin", "@romacode/schema/plugin", Plugin),
  ...namespaceTypes("Project", "@romacode/schema/project", Project),
  ...namespaceTypes("Worktree", "@romacode/schema/worktree", Worktree),
  ...namespaceTypes("PromptInput", "@romacode/schema/prompt-input", PromptInput),
  ...namespaceTypes("Provider", "@romacode/schema/provider", Provider),
  ...namespaceTypes("Pty", "@romacode/schema/pty", Pty),
  ...namespaceTypes("PtyTicket", "@romacode/schema/pty-ticket", PtyTicket),
  ...namespaceTypes("Question", "@romacode/schema/question", Question),
  ...namespaceTypes("Reference", "@romacode/schema/reference", Reference),
  ...namespaceTypes("Session", "@romacode/schema/session", Session),
  ...namespaceTypes("SessionMessage", "@romacode/schema/session-message", SessionMessage),
  ...namespaceTypes("SessionInbox", "@romacode/schema/session-inbox", SessionInbox),
  ...namespaceTypes("Shell", "@romacode/schema/shell", Shell),
  ...namespaceTypes("Skill", "@romacode/schema/skill", Skill),
  ...namespaceTypes("Snapshot", "@romacode/schema/snapshot", Snapshot),
  ...namespaceTypes("UsageLimits", "@romacode/schema/usage-limits", UsageLimits),
  ...namespaceTypes("Vcs", "@romacode/schema/vcs", Vcs),
  ...namespaceTypes("WebSearch", "@romacode/schema/websearch", WebSearch),
  ...namespaceTypes("Workspace", "@romacode/schema/workspace", Workspace),
  typeReference("Prompt", "@romacode/schema/prompt", Prompt),
  typeReference("PromptMention", "@romacode/schema/prompt", PromptMention),
  typeReference("FileAttachment", "@romacode/schema/prompt", FileAttachment),
  typeReference("AgentAttachment", "@romacode/schema/prompt", AgentAttachment),
  typeReference("AbsolutePath", "@romacode/schema/schema", AbsolutePath),
  typeReference("RelativePath", "@romacode/schema/schema", RelativePath),
]

await Effect.runPromise(
  Effect.all(
    [
      write(
        emitPromise(promiseContract, {
          mutableOutputs: true,
        }),
        fileURLToPath(new URL("../src/promise/generated", import.meta.url)),
      ),
      write(
        emitEffectImported(effectContract, {
          module: "../../contract",
          api: "ClientApi",
          shapeModule: "../api/api.js",
        }),
        fileURLToPath(new URL("../src/effect/generated", import.meta.url)),
      ),
      write(
        emitEffectShape(effectContract, {
          typeReferences: effectTypeReferences,
          outputTypes: {
            "event.subscribe": {
              name: "RomaCodeEvent",
              import: 'import type { RomaCodeEvent } from "@romacode/protocol/groups/event"',
            },
          },
        }),
        fileURLToPath(new URL("../src/effect/api", import.meta.url)),
      ),
    ],
    { concurrency: 3, discard: true },
  ).pipe(Effect.provide(NodeFileSystem.layer)),
)

function namespaceTypes(namespace: string, module: string, values: object) {
  return Object.entries(values).flatMap(([name, schema]) =>
    Schema.isSchema(schema) ? [typeReference(`${namespace}.${name}`, module, schema)] : [],
  )
}

function typeReference(name: string, module: string, schema: Schema.Top) {
  return {
    schema,
    name,
    import: `import type { ${name.split(".")[0]} } from ${JSON.stringify(module)}`,
  }
}
