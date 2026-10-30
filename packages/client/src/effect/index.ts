// TODO: Keep additional network capabilities inside Schema and Protocol as the client grows; /effect must never import
// Core or Server. Preserve these datatype exports so internal model reorganizations do not require caller migrations.
import type { Effect } from "effect"
import type { RomaCode } from "./client.js"

export * from "./generated/index"
export { RomaCode } from "./client.js"
export type {
  AgentApi,
  AppApi,
  CommandApi,
  ConfigApi,
  EventApi,
  IntegrationApi,
  ModelApi,
  PluginApi,
  ProviderApi,
  ReferenceApi,
  RpcApi,
  RpcClient,
  WebSearchApi,
  SessionApi,
  SkillApi,
} from "./api.js"
export { Agent } from "@romacode/schema/agent"
export { Command } from "@romacode/schema/command"
export { Config } from "@romacode/schema/config"
export { Credential } from "@romacode/schema/credential"
export { Event } from "@romacode/schema/event"
export { EventLog } from "@romacode/schema/event-log"
export { FileSystem } from "@romacode/schema/filesystem"
export { Form } from "@romacode/schema/form"
export { Integration } from "@romacode/schema/integration"
export { Location } from "@romacode/schema/location"
export { Model } from "@romacode/schema/model"
export { Permission } from "@romacode/schema/permission"
export { PermissionSaved } from "@romacode/schema/permission-saved"
export { Project } from "@romacode/schema/project"
export { Worktree } from "@romacode/schema/worktree"
export { Vcs } from "@romacode/schema/vcs"
export { Provider } from "@romacode/schema/provider"
export { Pty } from "@romacode/schema/pty"
export { Question } from "@romacode/schema/question"
export { Reference } from "@romacode/schema/reference"
export { WebSearch } from "@romacode/schema/websearch"
export { AbsolutePath, RelativePath } from "@romacode/schema/schema"
export { Session } from "@romacode/schema/session"
export { SessionInbox } from "@romacode/schema/session-inbox"
export { SessionMessage } from "@romacode/schema/session-message"
export { Skill } from "@romacode/schema/skill"
export { Prompt } from "@romacode/schema/prompt"
export { PromptInput } from "@romacode/schema/prompt-input"
export type { RomaCodeEvent } from "@romacode/protocol/groups/event"
export type RomaCodeClient = Effect.Success<ReturnType<typeof RomaCode.make>>
