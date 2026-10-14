import { sql } from 'drizzle-orm'

import type { Db } from './client'

/**
 * Throws unless the reports table can be read.
 * `select 1` alone passes on an empty database file, so it is not enough (14.10).
 */
export async function checkDatabase(db: Db): Promise<void> {
  await db.run(sql`select 1 from reports limit 1`)
}
