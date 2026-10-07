/** Applies every migration in ./drizzle to DATABASE_URL. Run: pnpm db:migrate */
import { mkdirSync } from 'node:fs'

import { migrate } from 'drizzle-orm/libsql/migrator'

import { createDb } from '../src/db/client'
import { getEnv } from '../src/env'

async function main(): Promise<void> {
  const env = getEnv()
  if (env.DATABASE_URL.startsWith('file:')) mkdirSync('data', { recursive: true })
  const { db, client } = createDb(env.DATABASE_URL, env.DATABASE_AUTH_TOKEN)
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log(`Migrations applied to ${env.DATABASE_URL}`)
  client.close()
}

main()
