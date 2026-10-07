import { isWorkingDay } from './day'
import type { Report } from './types'

/** The internship: 140 hours, ending on 30 October 2026 (README). */
export const INTERNSHIP = { targetHours: 140, lastDay: '2026-10-30' } as const

export type Progress = {
  totalHours: number
  targetHours: number
  /** Working days from `today` (inclusive) to the last day (inclusive). */
  workingDaysLeft: number
  /** Hours per remaining working day to reach the target; 0 when reached or no days left. */
  hoursPerDayNeeded: number
  reportedDays: number
}

function nextDay(day: string): string {
  const d = new Date(`${day}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

/** Monday–Friday days in [from, to], both inclusive, as YYYY-MM-DD strings. */
export function workingDaysBetween(from: string, to: string): string[] {
  const days: string[] = []
  for (let d = from; d <= to; d = nextDay(d)) if (isWorkingDay(d)) days.push(d)
  return days
}

/** Pure: reports + today → the numbers /postep shows. No arithmetic anywhere else (#26). */
export function progressOf(reports: Report[], today: string, internship = INTERNSHIP): Progress {
  const totalHours = Math.round(reports.reduce((sum, r) => sum + r.hours, 0) * 100) / 100
  const workingDaysLeft = workingDaysBetween(today, internship.lastDay).length
  const missing = Math.max(0, internship.targetHours - totalHours)
  const hoursPerDayNeeded =
    workingDaysLeft === 0 || missing === 0 ? 0 : Math.round((missing / workingDaysLeft) * 10) / 10
  return {
    totalHours,
    targetHours: internship.targetHours,
    workingDaysLeft,
    hoursPerDayNeeded,
    reportedDays: reports.length,
  }
}
