export * as ServerAuth from "./auth"

import { Context, Layer, Option } from "effect"

// RomaCode servers run without authorization: no password exists, no sessions are
// issued, and every request is served. This module only carries the (empty) auth
// configuration slot so handlers stay wired.

export type Info = {
  readonly password: Option.Option<string>
  readonly username: string
}

export class Config extends Context.Service<Config, Info>()("@romacode/ServerAuthConfig") {
  static configLayer(input: Pick<Info, "password">) {
    return Layer.succeed(this, this.of({ ...input, username: "romacode" }))
  }

  static get layer() {
    return this.configLayer({ password: Option.none() })
  }
}
