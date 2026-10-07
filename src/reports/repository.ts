import { getDb } from '@/db/client'

import { SqliteReportRepository } from './sqlite-repository'
import type { ReportRepository } from './types'

let cached: ReportRepository | undefined

/** The one place that decides which repository the app uses (#20). Tests build their own. */
export function getReportRepository(): ReportRepository {
  cached ??= new SqliteReportRepository(getDb())
  return cached
}
