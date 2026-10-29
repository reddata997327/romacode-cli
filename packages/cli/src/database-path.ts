import path from "node:path"
import { ROMACODE_CHANNEL } from "./version"

export function databasePath(data: string) {
  const filename =
    process.env.ROMACODE_DB ??
    (["latest", "dev", "beta", "next", "prod"].includes(ROMACODE_CHANNEL) ||
    process.env.ROMACODE_DISABLE_CHANNEL_DB === "1" ||
    process.env.ROMACODE_DISABLE_CHANNEL_DB === "true"
      ? "romacode.db"
      : `romacode-${ROMACODE_CHANNEL.replace(/[^a-zA-Z0-9._-]/g, "-")}.db`)
  return filename === ":memory:" ? filename : path.resolve(data, filename)
}
