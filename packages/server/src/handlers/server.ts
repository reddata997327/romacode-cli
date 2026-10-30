import { hostname } from "node:os"
import { Effect } from "effect"
import { HttpApiBuilder } from "effect/http-api"
import { PersistentPty } from "@romacode/core/persistent-pty"
import { UnauthorizedError } from "@romacode/protocol/errors"
import { Api } from "../api"
import { ServerInfo } from "../server-info"
import { ServerPairing } from "../pairing"

export const ServerHandler = HttpApiBuilder.group(Api, "server.server", (handlers) =>
  Effect.gen(function* () {
    const pairing = yield* ServerPairing.Service

    return handlers
      .handle("server.info", () =>
        Effect.gen(function* () {
          const info = yield* ServerInfo.Service
          return {
            version: info.app.version ?? "unknown",
            pid: process.pid ?? 0,
            hostname: hostname() || undefined,
            urls: info.urls(),
            paths: info.paths,
            capabilities: { persistentPty: PersistentPty.available },
          }
        }),
      )
      .handle("server.pair", () => pairing.issue())
      .handle("server.connect", () =>
        // RomaCode servers issue no sessions: pairing links can never authenticate.
        new UnauthorizedError({ message: "RomaCode servers do not support pairing links" }),
      )
  }),
)
