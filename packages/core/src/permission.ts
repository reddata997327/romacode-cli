export * as Permission from "./permission.js"

import { Context, Effect, Layer, Schema } from "effect"
import { Permission, Rule, Ruleset } from "@romacode/schema/permission"
import { makeLocationNode } from "@romacode/util/effect/app-node"
import { SessionErrors } from "./session/error.js"

export { Rule, Ruleset }

export const ID = Permission.ID
export type ID = typeof ID.Type

export const Source = Permission.Source
export type Source = typeof Source.Type

export const Request = Permission.Request
export type Request = typeof Request.Type

export const Reply = Permission.Reply
export type Reply = typeof Reply.Type

export interface AssertInput extends Omit<Request, "id" | "message"> {
  readonly id?: ID
  readonly agent?: string
}

export interface ReplyInput {
  readonly requestID: ID
  readonly reply: Reply
  readonly message?: string
}

export interface AskResult {
  readonly id: ID
  readonly effect: Permission.Effect
}

export { Event } from "@romacode/schema/permission"

// RomaCode runs without a permission system: every action is allowed, no prompts are ever
// raised, and no rules are evaluated or persisted. The types and service surface are kept
// so tools and API consumers stay source-compatible; every check resolves to "allow".

export class DeclinedError extends Schema.TaggedError<DeclinedError>()("Permission.DeclinedError", {}) {}

export class CorrectedError extends Schema.TaggedError<CorrectedError>()("Permission.CorrectedError", {
  feedback: Schema.String,
}) {}

export class BlockedError extends Schema.TaggedError<BlockedError>()("Permission.BlockedError", {
  rules: Schema.Array(Rule),
  permission: Schema.String,
  resources: Schema.Array(Schema.String),
  reason: Schema.optional(Schema.String),
}) {
  override get message() {
    return this.reason ?? `Permission denied: ${this.permission}`
  }
}

export type Error = BlockedError | CorrectedError

export class NotFoundError extends Schema.TaggedError<NotFoundError>()("Permission.NotFoundError", {
  requestID: ID,
}) {}

export function evaluate(_action: string, _resource: string, ..._rulesets: Permission.Ruleset[]): Permission.Rule {
  return { action: "*", resource: "*", effect: "allow" }
}

export function merge(...rulesets: Permission.Ruleset[]): Permission.Ruleset {
  return rulesets.flat()
}

export interface Interface {
  readonly close: Effect.Effect<void>
  readonly ask: (input: AssertInput) => Effect.Effect<AskResult, SessionErrors.NotFoundError>
  readonly assert: (input: AssertInput) => Effect.Effect<void, Error | SessionErrors.NotFoundError>
  /** Fails only when the rules deny the request; never asks the user. */
  readonly assertNotDenied: (input: AssertInput) => Effect.Effect<void, BlockedError | SessionErrors.NotFoundError>
  readonly reply: (input: ReplyInput) => Effect.Effect<void, NotFoundError>
  readonly get: (id: ID) => Effect.Effect<Request | undefined>
  readonly forSession: (sessionID: string) => Effect.Effect<ReadonlyArray<Request>>
  readonly list: () => Effect.Effect<ReadonlyArray<Request>>
}

export class Service extends Context.Service<Service, Interface>()("@romacode/Permission") {}

const layer = Layer.succeed(
  Service,
  Service.of({
    close: Effect.void,
    ask: (input) => Effect.succeed({ id: input.id ?? ID.create(), effect: "allow" as const }),
    assert: () => Effect.void,
    assertNotDenied: () => Effect.void,
    reply: (input) => Effect.fail(new NotFoundError({ requestID: input.requestID })),
    get: () => Effect.succeed(undefined),
    forSession: () => Effect.succeed([]),
    list: () => Effect.succeed([]),
  }),
)

export const node = makeLocationNode({
  service: Service,
  layer,
  deps: [],
})
