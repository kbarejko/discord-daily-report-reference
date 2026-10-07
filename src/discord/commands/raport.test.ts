import { describe, expect, it } from 'vitest'

import { command, testContext } from '@/discord/test-helpers'
import type { ModalResponse } from '@/discord/types'

import { RAPORT_MODAL, raport } from './raport'

describe('/raport', () => {
  it('opens a modal with the four fields, done and hours required', async () => {
    const response = (await raport(command('raport'), testContext())) as ModalResponse
    expect(response.type).toBe(9)
    expect(response.data.custom_id).toBe(RAPORT_MODAL)
    expect(response.data.title).toBe('Raport za 2026-10-07')
    const inputs = response.data.components.map((row) => row.components[0])
    expect(inputs.map((i) => i.custom_id)).toEqual(['done', 'hours', 'problems', 'plan'])
    expect(inputs.map((i) => i.required)).toEqual([true, true, false, false])
    expect(inputs.every((i) => i.label.length <= 45)).toBe(true)
  })

  it('pre-fills the form when today already has a report (D7)', async () => {
    const ctx = testContext()
    await ctx.reports.upsert({
      discordUserId: 'u1',
      day: '2026-10-07',
      done: 'Endpoint',
      hours: 7.5,
      problems: null,
      plan: 'Router',
    })
    const response = (await raport(command('raport'), ctx)) as ModalResponse
    const value = (id: string) =>
      response.data.components.map((r) => r.components[0]).find((i) => i.custom_id === id)?.value
    expect(value('done')).toBe('Endpoint')
    expect(value('hours')).toBe('7,5')
    expect(value('problems')).toBeUndefined()
    expect(value('plan')).toBe('Router')
  })
})
