import { migrate } from 'drizzle-orm/libsql/migrator'
import { describe, expect, it } from 'vitest'

import { createDb } from './client'
import { checkDatabase } from './health'

describe('checkDatabase', () => {
  it('passes when the reports table exists', async () => {
    const { db } = createDb(':memory:')
    await migrate(db, { migrationsFolder: './drizzle' })
    await expect(checkDatabase(db)).resolves.toBeUndefined()
  })

  it('fails on an empty database without the reports table, like on 14.10', async () => {
    const { db } = createDb(':memory:')
    const error = await checkDatabase(db).catch((caught: unknown) => caught)
    expect(error).toBeInstanceOf(Error)
    expect(String((error as Error).cause)).toContain('no such table: reports')
  })
})
