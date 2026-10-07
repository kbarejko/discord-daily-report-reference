import { describe, expect, it } from 'vitest'

import { progressOf, workingDaysBetween } from './progress'
import type { Report } from './types'

const report = (day: string, hours: number): Report => ({
  id: day,
  discordUserId: 'u1',
  day,
  done: 'x',
  hours,
  problems: null,
  plan: null,
  createdAt: new Date(),
  updatedAt: new Date(),
})

describe('workingDaysBetween', () => {
  it('skips the weekend and includes both ends', () => {
    // Fri 9, Sat 10, Sun 11, Mon 12
    expect(workingDaysBetween('2026-10-09', '2026-10-12')).toEqual(['2026-10-09', '2026-10-12'])
  })

  it('is empty when from is after to', () => {
    expect(workingDaysBetween('2026-11-02', '2026-10-30')).toEqual([])
  })
})

describe('progressOf', () => {
  it('sums hours and counts the working days left, today included', () => {
    const p = progressOf([report('2026-10-05', 7), report('2026-10-06', 7.5)], '2026-10-07')
    expect(p.totalHours).toBe(14.5)
    expect(p.reportedDays).toBe(2)
    // 7–9 Oct (3), 12–16 (5), 19–23 (5), 26–30 (5)
    expect(p.workingDaysLeft).toBe(18)
    expect(p.hoursPerDayNeeded).toBe(7) // (140 - 14.5) / 18 = 6.97 → 7
  })

  it('works with no reports and on a weekend day', () => {
    const p = progressOf([], '2026-10-10') // Saturday
    expect(p.totalHours).toBe(0)
    expect(p.workingDaysLeft).toBe(15)
    expect(p.hoursPerDayNeeded).toBe(9.3) // 140 / 15 = 9.33
  })

  it('needs nothing per day once the target is reached or the internship is over', () => {
    expect(progressOf([report('2026-10-05', 140)], '2026-10-07').hoursPerDayNeeded).toBe(0)
    const over = progressOf([report('2026-10-05', 7)], '2026-11-02')
    expect(over.workingDaysLeft).toBe(0)
    expect(over.hoursPerDayNeeded).toBe(0)
  })
})
