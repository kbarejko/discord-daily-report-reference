import { describe, expect, it } from 'vitest'

import { formatHours, messages } from './messages'

describe('messages', () => {
  it('formats hours with a Polish decimal comma', () => {
    expect(formatHours(7)).toBe('7 h')
    expect(formatHours(7.5)).toBe('7,5 h')
    expect(messages.saved('2026-10-07', 7.5)).toBe('Zapisano raport za 2026-10-07: 7,5 h.')
  })

  it('uses the Polish plural of "raport"', () => {
    const count = (n: number) => messages.export.ready('a', 'b', n).split(': ')[1]
    expect([1, 2, 4, 5, 12, 21, 22, 24, 25, 112].map(count)).toEqual([
      '1 raport.',
      '2 raporty.',
      '4 raporty.',
      '5 raportów.',
      '12 raportów.',
      '21 raportów.',
      '22 raporty.',
      '24 raporty.',
      '25 raportów.',
      '112 raportów.',
    ])
  })

  it('says "raport", never "wpis" (the noun; "wpisz" the verb is fine)', () => {
    const text = JSON.stringify(messages)
    expect(text).not.toMatch(/\bwpis(u|y|ów|ie|em|ami|ach)?\b/i)
    expect(text).toMatch(/wpisz/i) // the verb is used on purpose: "Wpisz /raport"
  })
})
