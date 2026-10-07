import { describe, expect, it } from 'vitest'

import { command, testContext } from '@/discord/test-helpers'
import type { MessageResponse } from '@/discord/types'

import { bar, postep } from './postep'

describe('/postep', () => {
  it('draws the bar', () => {
    expect(bar(84, 140)).toBe('▓▓▓▓▓▓░░░░')
    expect(bar(0, 140)).toBe('░░░░░░░░░░')
    expect(bar(150, 140)).toBe('▓▓▓▓▓▓▓▓▓▓')
  })

  it('shows hours, the bar and what is left, only to the caller', async () => {
    const ctx = testContext()
    await ctx.reports.upsert({
      discordUserId: 'u1',
      day: '2026-10-05',
      done: 'x',
      hours: 7,
      problems: null,
      plan: null,
    })
    await ctx.reports.upsert({
      discordUserId: 'u1',
      day: '2026-10-06',
      done: 'x',
      hours: 7.5,
      problems: null,
      plan: null,
    })
    const r = (await postep(command('postep'), ctx)) as MessageResponse
    expect(r.data?.flags).toBe(64)
    expect(r.data?.content).toContain('▓░░░░░░░░░ 14,5 / 140 h')
    expect(r.data?.content).toContain('18')
    expect(r.data?.content).toContain('7 h')
  })
})
