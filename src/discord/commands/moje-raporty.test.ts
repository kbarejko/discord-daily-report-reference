import { describe, expect, it } from 'vitest'

import { command, testContext } from '@/discord/test-helpers'
import type { MessageResponse } from '@/discord/types'

import { firstLine, mojeRaporty } from './moje-raporty'

describe('/moje-raporty', () => {
  it('tells an empty user to use /raport', async () => {
    const response = (await mojeRaporty(command('moje-raporty'), testContext())) as MessageResponse
    expect(response.data?.flags).toBe(64)
    expect(response.data?.content).toContain('/raport')
  })

  it('shows the last 7 reports, newest first, one field each', async () => {
    const ctx = testContext()
    // Nine days ending today (2026-10-07); the list never shows the future.
    const days = [
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
      '2026-10-03',
      '2026-10-04',
      '2026-10-05',
      '2026-10-06',
      '2026-10-07',
    ]
    for (const [i, day] of days.entries()) {
      await ctx.reports.upsert({
        discordUserId: 'u1',
        day,
        done: `Dzień ${i + 1}\nDruga linia`,
        hours: i + 1,
        problems: null,
        plan: null,
      })
    }
    const response = (await mojeRaporty(command('moje-raporty'), ctx)) as MessageResponse
    const fields = response.data?.embeds?.[0].fields ?? []
    expect(fields).toHaveLength(7)
    expect(fields[0]).toEqual({ name: '2026-10-07 · 9 h', value: 'Dzień 9' })
    expect(fields[6].name).toBe('2026-10-01 · 3 h')
  })

  it('keeps a very long report inside Discord limits', async () => {
    const ctx = testContext()
    await ctx.reports.upsert({
      discordUserId: 'u1',
      day: '2026-10-07',
      done: 'x'.repeat(1000),
      hours: 7,
      problems: null,
      plan: null,
    })
    const response = (await mojeRaporty(command('moje-raporty'), ctx)) as MessageResponse
    const value = response.data?.embeds?.[0].fields?.[0].value ?? ''
    expect(value.length).toBeLessThanOrEqual(200)
    expect(value.endsWith('…')).toBe(true)
    expect(firstLine('a\nb')).toBe('a')
  })
})
