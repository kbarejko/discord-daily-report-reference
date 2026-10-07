/** Loads a backup file into DATABASE_URL, replacing reports with the same person and day. Run: pnpm db:restore backups/<file>.json */
import { readFileSync } from 'node:fs'

import { getDb } from '../src/db/client'
import { reports } from '../src/db/schema'

async function main(): Promise<void> {
  const file = process.argv[2]
  if (!file) {
    console.error('Usage: pnpm db:restore backups/<file>.json')
    process.exit(1)
  }
  const rows = JSON.parse(readFileSync(file, 'utf8')) as Array<Record<string, unknown>>
  const db = getDb()
  for (const row of rows) {
    const values = {
      ...row,
      createdAt: new Date(row.createdAt as string),
      updatedAt: new Date(row.updatedAt as string),
    } as typeof reports.$inferInsert
    await db
      .insert(reports)
      .values(values)
      .onConflictDoUpdate({
        target: [reports.discordUserId, reports.day],
        set: {
          done: values.done,
          hours: values.hours,
          problems: values.problems,
          plan: values.plan,
          updatedAt: values.updatedAt,
        },
      })
  }
  console.log(`${rows.length} report(s) restored from ${file}`)
}

main()
