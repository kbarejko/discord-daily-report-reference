import { describe, expect, it } from 'vitest'

import type { Report } from '@/reports/types'

import { teamOverview } from './team'

const report = (discordUserId: string, day: string, hours: number): Report => ({
  id: `${discordUserId}-${day}`,
  discordUserId,
  day,
  done: 'x',
  hours,
  problems: null,
  plan: null,
  createdAt: new Date(),
  updatedAt: new Date(),
})

describe('teamOverview', () => {
  it('groups reports per person and keeps their order', () => {
    const people = teamOverview(
      [
        report('u1', '2026-10-14', 7),
        report('u2', '2026-10-14', 6),
        report('u1', '2026-10-13', 7.5),
      ],
      '2026-10-14',
    )
    expect(people.map((p) => p.discordUserId)).toEqual(['u1', 'u2'])
    expect(people[0].reports.map((r) => r.day)).toEqual(['2026-10-14', '2026-10-13'])
  })

  it('gives each person the same numbers /postep shows', () => {
    const [person] = teamOverview(
      [report('u1', '2026-10-13', 7.5), report('u1', '2026-10-14', 6)],
      '2026-10-14',
    )
    expect(person.progress).toMatchObject({ totalHours: 13.5, targetHours: 140, reportedDays: 2 })
  })

  it('is empty without reports', () => {
    expect(teamOverview([], '2026-10-14')).toEqual([])
  })
})
