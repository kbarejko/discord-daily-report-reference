import { and, asc, eq, gte, lte } from 'drizzle-orm'

import type { Db } from '@/db/client'
import { reports } from '@/db/schema'

import type { NewReport, Report, ReportRepository } from './types'

/** The real repository: one table, one unique index for D7 (see db/schema.ts). */
export class SqliteReportRepository implements ReportRepository {
  constructor(private readonly db: Db) {}

  async upsert(input: NewReport): Promise<Report> {
    const now = new Date()
    await this.db
      .insert(reports)
      .values({ id: crypto.randomUUID(), ...input, createdAt: now, updatedAt: now })
      // Same person, same day: the unique index fires and the row is updated in place (D7).
      .onConflictDoUpdate({
        target: [reports.discordUserId, reports.day],
        set: {
          done: input.done,
          hours: input.hours,
          problems: input.problems,
          plan: input.plan,
          updatedAt: now,
        },
      })
    const saved = await this.findByUserAndDay(input.discordUserId, input.day)
    if (!saved) throw new Error('Report vanished right after upsert')
    return saved
  }

  async findByUserAndDay(discordUserId: string, day: string): Promise<Report | null> {
    const row = await this.db.query.reports.findFirst({
      where: and(eq(reports.discordUserId, discordUserId), eq(reports.day, day)),
    })
    return row ?? null
  }

  async listByUser(discordUserId: string, range: { from: string; to: string }): Promise<Report[]> {
    return this.db.query.reports.findMany({
      where: and(
        eq(reports.discordUserId, discordUserId),
        gte(reports.day, range.from),
        lte(reports.day, range.to),
      ),
      orderBy: [asc(reports.day)],
    })
  }

  async listUserIdsWithReport(day: string): Promise<string[]> {
    const rows = await this.db
      .selectDistinct({ discordUserId: reports.discordUserId })
      .from(reports)
      .where(eq(reports.day, day))
    return rows.map((r) => r.discordUserId)
  }
}
