import { migrate } from 'drizzle-orm/libsql/migrator'

import { createDb } from '@/db/client'

import { describeReportRepository } from './repository.suite'
import { SqliteReportRepository } from './sqlite-repository'

describeReportRepository('SqliteReportRepository', async () => {
  // A fresh in-memory database per test, with the real migrations applied.
  const { db } = createDb(':memory:')
  await migrate(db, { migrationsFolder: './drizzle' })
  return new SqliteReportRepository(db)
})
