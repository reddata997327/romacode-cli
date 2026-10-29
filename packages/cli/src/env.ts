// Every environment variable the CLI reads, in one place. Consumers yield
// these instead of touching process.env so the full surface stays visible,
// typed, and redacted where secret.

export function session() {
  return Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] =>
        entry[1] !== undefined && entry[0] !== "ROMACODE_PASSWORD" && entry[0] !== "ROMACODE_SERVER_PASSWORD",
    ),
  )
}

export * as Env from "./env"
