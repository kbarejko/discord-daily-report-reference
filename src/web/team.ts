import { progressOf, type Progress } from '@/reports/progress'
import type { Report } from '@/reports/types'

export type PersonOverview = {
  discordUserId: string
  progress: Progress
  /** In the order they came in: newest day first when they come from listAll(). */
  reports: Report[]
}

/** Pure: every report → one entry per person with their /postep numbers (#25). The page only renders this. */
export function teamOverview(reports: Report[], today: string): PersonOverview[] {
  const byUser = new Map<string, Report[]>()
  for (const report of reports) {
    const list = byUser.get(report.discordUserId) ?? []
    list.push(report)
    byUser.set(report.discordUserId, list)
  }
  return [...byUser].map(([discordUserId, own]) => ({
    discordUserId,
    progress: progressOf(own, today),
    reports: own,
  }))
}
