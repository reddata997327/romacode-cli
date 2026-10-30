import { Effect } from "effect"
import type { DatabaseMigration } from "../migration.js"

const migration: DatabaseMigration.Migration = {
  id: "20261028111118_ambitious_freak",
  up(tx) {
    return Effect.gen(function* () {
      yield* tx.run(`DROP INDEX IF EXISTS \`permission_project_action_resource_idx\`;`)
      yield* tx.run(`DROP TABLE \`permission\`;`)
    })
  },
}

export default migration
