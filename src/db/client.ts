import { createClient, type Client } from '@libsql/client'
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql'

import { getEnv } from '@/env'

import * as schema from './schema'

export type Db = LibSQLDatabase<typeof schema>

/** A database for the given URL: `file:./data/reports.db` locally, `libsql://…` on Turso, `:memory:` in tests. */
export function createDb(url: string, authToken?: string): { db: Db; client: Client } {
  const client = createClient({ url, authToken })
  return { db: drizzle(client, { schema }), client }
}

let cached: Db | undefined

/** The app's database, opened on first use from DATABASE_URL (D5). */
export function getDb(): Db {
  if (!cached) {
    const env = getEnv()
    cached = createDb(env.DATABASE_URL, env.DATABASE_AUTH_TOKEN).db
  }
  return cached
}
