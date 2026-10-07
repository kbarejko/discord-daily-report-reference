import { describe, expect, it } from 'vitest'

import { command, testContext } from '@/discord/test-helpers'
import type { ApplicationCommandInteraction, MessageResponse } from '@/discord/types'

import { eksport } from './eksport'

function withOptions(options: Record<string, string>): ApplicationCommandInteraction {
  return {
    ...command('eksport'),
    data: {
      name: 'eksport',
      options: Object.entries(options).map(([name, value]) => ({ name, value })),
    },
  }
}

describe('/eksport', () => {
  it('defers, then sends the file through the follow-up, only to the caller', async () => {
    const ctx = testContext()
    await ctx.reports.upsert({
      discordUserId: 'u1',
      day: '2026-10-06',
      done: 'Dzień',
      hours: 7,
      problems: null,
      plan: null,
    })
    const response = (await eksport(
      withOptions({ od: '2026-10-05', do: '2026-10-07' }),
      ctx,
    )) as MessageResponse
    expect(response.type).toBe(5)
    expect(response.data?.flags).toBe(64)
    await ctx.flushDeferred()
    expect(ctx.sent).toHaveLength(1)
    const [sent] = ctx.sent
    expect(sent.message.content).toBe('Dziennik za 2026-10-05 – 2026-10-07: 1 raport.')
    expect(sent.message.file?.filename).toBe('dziennik-anna-2026-10-05-2026-10-07.md')
    expect(sent.message.file?.content).toContain('## 2026-10-06 (wtorek)')
    expect(sent.message.file?.content).toContain('## 2026-10-05 (poniedziałek)\n\n_brak raportu_')
  })

  it('defaults to the whole internship up to today', async () => {
    const ctx = testContext()
    await eksport(command('eksport'), ctx)
    await ctx.flushDeferred()
    expect(ctx.sent[0].message.file?.filename).toBe('dziennik-anna-2026-10-05-2026-10-07.md')
    expect(ctx.sent[0].message.content).toContain('Brak raportów')
  })

  it('rejects a bad range without deferring', async () => {
    const ctx = testContext()
    const response = (await eksport(
      withOptions({ od: '2026-10-09', do: '2026-10-05' }),
      ctx,
    )) as MessageResponse
    expect(response.type).toBe(4)
    expect(response.data?.content).toContain('RRRR-MM-DD')
    expect(ctx.sent).toHaveLength(0)
  })
})
