/** Writes every report to backups/reports-<timestamp>.json. Run: pnpm db:backup */
import { mkdirSync, writeFileSync } from 'node:fs'

import { getDb } from '../src/db/client'
import { reports } from '../src/db/schema'

async function main(): Promise<void> {
  const rows = await getDb().select().from(reports)
  mkdirSync('backups', { recursive: true })
  const file = `backups/reports-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  writeFileSync(file, JSON.stringify(rows, null, 2))
  console.log(`${rows.length} report(s) written to ${file}`)
}

main()
