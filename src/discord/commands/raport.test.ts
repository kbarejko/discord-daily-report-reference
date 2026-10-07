import { describe, expect, it } from 'vitest'

import { command, modal, testContext } from '@/discord/test-helpers'
import type { ModalResponse } from '@/discord/types'

import { RAPORT_MODAL, raport, saveRaport } from './raport'

describe('/raport', () => {
  it('opens a modal with the four fields, done and hours required', async () => {
    const response = (await raport(command('raport'), testContext())) as ModalResponse
    expect(response.type).toBe(9)
    expect(response.data.custom_id).toBe(`${RAPORT_MODAL}:2026-10-07`)
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

describe('submitted /raport form', () => {
  it('saves a valid report and confirms with the day and hours', async () => {
    const ctx = testContext()
    const response = await saveRaport(
      modal(RAPORT_MODAL, { done: 'Endpoint PING', hours: '7,5', problems: '', plan: '' }),
      ctx,
    )
    expect(response).toMatchObject({ type: 4, data: { flags: 64 } })
    expect((response as { data: { content: string } }).data.content).toContain(
      'Zapisano raport za 2026-10-07: 7,5 h.',
    )
    const saved = await ctx.reports.findByUserAndDay('u1', '2026-10-07')
    expect(saved).toMatchObject({ done: 'Endpoint PING', hours: 7.5, problems: null, plan: null })
  })

  it('says when it replaced an earlier report of the same day', async () => {
    const ctx = testContext()
    await saveRaport(modal(RAPORT_MODAL, { done: 'Pierwsza wersja', hours: '3' }), ctx)
    const response = await saveRaport(
      modal(RAPORT_MODAL, { done: 'Druga wersja', hours: '7' }),
      ctx,
    )
    expect((response as { data: { content: string } }).data.content).toContain('zastąpiony')
    expect((await ctx.reports.findByUserAndDay('u1', '2026-10-07'))?.done).toBe('Druga wersja')
  })

  it('lists what to fix and saves nothing when the form is invalid', async () => {
    const ctx = testContext()
    const response = await saveRaport(modal(RAPORT_MODAL, { done: 'ok', hours: 'dużo' }), ctx)
    const content = (response as { data: { content: string } }).data.content
    expect(content).toContain('Raport nie został zapisany')
    expect(content).toContain('co najmniej 3 znaki')
    expect(content).toContain('liczbę')
    expect(await ctx.reports.findByUserAndDay('u1', '2026-10-07')).toBeNull()
  })
})
