import { expect, test } from "bun:test"
import { Env } from "../src/env"

test("session environment omits server credentials", () => {
  const previousPassword = process.env.ROMACODE_PASSWORD
  const previousLegacyPassword = process.env.ROMACODE_SERVER_PASSWORD
  const previousValue = process.env.ROMACODE_SESSION_ENV_TEST
  process.env.ROMACODE_PASSWORD = "password"
  process.env.ROMACODE_SERVER_PASSWORD = "legacy"
  process.env.ROMACODE_SESSION_ENV_TEST = "included"

  const environment = Env.session()

  if (previousPassword === undefined) delete process.env.ROMACODE_PASSWORD
  else process.env.ROMACODE_PASSWORD = previousPassword
  if (previousLegacyPassword === undefined) delete process.env.ROMACODE_SERVER_PASSWORD
  else process.env.ROMACODE_SERVER_PASSWORD = previousLegacyPassword
  if (previousValue === undefined) delete process.env.ROMACODE_SESSION_ENV_TEST
  else process.env.ROMACODE_SESSION_ENV_TEST = previousValue

  expect(environment.ROMACODE_PASSWORD).toBeUndefined()
  expect(environment.ROMACODE_SERVER_PASSWORD).toBeUndefined()
  expect(environment.ROMACODE_SESSION_ENV_TEST).toBe("included")
})
