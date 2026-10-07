export type Report = {
  id: string
  discordUserId: string
  /** Local date in Europe/Warsaw, YYYY-MM-DD: the day the report is about. */
  day: string
  done: string
  hours: number
  problems: string | null
  plan: string | null
  createdAt: Date
  updatedAt: Date
}

export type NewReport = Omit<Report, 'id' | 'createdAt' | 'updatedAt'>

export interface ReportRepository {
  /** Creates the day's report or replaces it: one report per person per day (D7). */
  upsert(input: NewReport): Promise<Report>
  findByUserAndDay(discordUserId: string, day: string): Promise<Report | null>
  listByUser(discordUserId: string, range: { from: string; to: string }): Promise<Report[]>
  /** Who reported on a given day, for the reminder. */
  listUserIdsWithReport(day: string): Promise<string[]>
}
