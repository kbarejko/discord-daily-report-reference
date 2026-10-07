import type { NewReport, Report, ReportRepository } from './types'

/** Keeps reports in an array. Used in tests and until the SQLite version exists. */
export class MemoryReportRepository implements ReportRepository {
  private reports: Report[] = []

  async upsert(input: NewReport): Promise<Report> {
    const now = new Date()
    const existing = this.reports.find(
      (r) => r.discordUserId === input.discordUserId && r.day === input.day,
    )
    if (existing) {
      Object.assign(existing, input, { updatedAt: now })
      return existing
    }
    const report: Report = { ...input, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
    this.reports.push(report)
    return report
  }

  async findByUserAndDay(discordUserId: string, day: string): Promise<Report | null> {
    return this.reports.find((r) => r.discordUserId === discordUserId && r.day === day) ?? null
  }

  async listByUser(discordUserId: string, range: { from: string; to: string }): Promise<Report[]> {
    return this.reports
      .filter((r) => r.discordUserId === discordUserId && r.day >= range.from && r.day <= range.to)
      .sort((a, b) => a.day.localeCompare(b.day))
  }

  async listUserIdsWithReport(day: string): Promise<string[]> {
    return this.reports.filter((r) => r.day === day).map((r) => r.discordUserId)
  }
}
