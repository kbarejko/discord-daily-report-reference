import type { ReportRepository } from '@/reports/types'

/** What every handler may use. Built once per request in the route; tests build their own. */
export type Context = {
  reports: ReportRepository
  /** The current moment; tests pin it. */
  now: () => Date
}
