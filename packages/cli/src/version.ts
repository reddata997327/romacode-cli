import { Option, Schema } from "effect"

declare const ROMACODE_VERSION: string
declare const ROMACODE_CHANNEL: string
declare const ROMACODE_ARTIFACT: string
declare const ROMACODE_RELEASE_HIGHLIGHTS: string

const version = typeof ROMACODE_VERSION === "string" ? ROMACODE_VERSION : "local"
const channel = typeof ROMACODE_CHANNEL === "string" ? ROMACODE_CHANNEL : "local"
const artifact = typeof ROMACODE_ARTIFACT === "string" ? ROMACODE_ARTIFACT : "cli"
// Stable release builds embed the release notes' Highlights; every other build has none.
const highlights =
  typeof ROMACODE_RELEASE_HIGHLIGHTS === "string"
    ? Option.getOrElse(
        Schema.decodeUnknownOption(
          Schema.fromJsonString(Schema.Array(Schema.Struct({ title: Schema.String, body: Schema.String }))),
        )(ROMACODE_RELEASE_HIGHLIGHTS),
        () => [],
      )
    : []

export {
  version as ROMACODE_VERSION,
  channel as ROMACODE_CHANNEL,
  artifact as ROMACODE_ARTIFACT,
  highlights as ROMACODE_HIGHLIGHTS,
}
export const ROMACODE_LOCAL = channel === "local"
