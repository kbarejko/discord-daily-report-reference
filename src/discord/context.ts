import type { DiscordClient } from '@/discord/client'
import type { ReportRepository } from '@/reports/types'

/** What every handler may use. Built once per request in the route; tests build their own. */
export type Context = {
  reports: ReportRepository
  /** Our application id, needed for follow-up URLs. */
  applicationId: string
  /** The current moment; tests pin it. */
  now: () => Date
  /** Discord's REST API, for follow-up messages after a deferred reply (D3). */
  discord: DiscordClient
  /** Runs `work` after the response has been sent (Next's `after()` in the route, immediate in tests). */
  defer: (work: () => Promise<void>) => void
}
