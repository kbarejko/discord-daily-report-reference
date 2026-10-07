import { describe, expect, it } from 'vitest'

import { command, modal, testContext } from '@/discord/test-helpers'
import type { ApplicationCommandInteraction, ModalResponse } from '@/discord/types'

import { modalId, raport, resolveDay, saveRaport } from './raport'

const today = '2026-10-07'

describe('resolveDay (#31)', () => {
  it('is today without the option', () => {
    expect(resolveDay(undefined, today)).toEqual({ ok: true, day: today })
  })

  it('accepts today and up to 7 days back', () => {
    expect(resolveDay('2026-10-07', today)).toEqual({ ok: true, day: '2026-10-07' })
    expect(resolveDay('2026-09-30', today)).toEqual({ ok: true, day: '2026-09-30' })
  })

  it('refuses tomorrow, 8 days back and nonsense', () => {
    expect(resolveDay('2026-10-08', today)).toMatchObject({
      ok: false,
      error: expect.stringContaining('jeszcze nie było'),
    })
    expect(resolveDay('2026-09-29', today)).toMatchObject({
      ok: false,
      error: expect.stringContaining('7 dni'),
    })
    expect(resolveDay('wczoraj', today)).toMatchObject({
      ok: false,
      error: expect.stringContaining('RRRR-MM-DD'),
    })
    expect(resolveDay('2026-02-30', today)).toMatchObject({ ok: false })
  })
})

describe('/raport dzien', () => {
  const withDay = (day: string): ApplicationCommandInteraction => ({
    ...command('raport'),
    data: { name: 'raport', options: [{ name: 'dzien', value: day }] },
  })

  it('opens the form for that day and saves under it', async () => {
    const ctx = testContext()
    const form = (await raport(withDay('2026-10-06'), ctx)) as ModalResponse
    expect(form.type).toBe(9)
    expect(form.data.title).toBe('Raport za 2026-10-06')
    expect(form.data.custom_id).toBe('raport:2026-10-06')
    await saveRaport(modal(modalId('2026-10-06'), { done: 'Wczorajsza praca', hours: '5' }), ctx)
    expect((await ctx.reports.findByUserAndDay('u1', '2026-10-06'))?.hours).toBe(5)
    expect(await ctx.reports.findByUserAndDay('u1', today)).toBeNull()
  })

  it('answers with the reason instead of a form for a future day', async () => {
    const response = await raport(withDay('2026-10-08'), testContext())
    expect(response.type).toBe(4)
  })
})
