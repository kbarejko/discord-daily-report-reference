import { describe, expect, it } from 'vitest'

import { formatHours, messages } from './messages'

describe('messages', () => {
  it('formats hours with a Polish decimal comma', () => {
    expect(formatHours(7)).toBe('7 h')
    expect(formatHours(7.5)).toBe('7,5 h')
    expect(messages.saved('2026-10-07', 7.5)).toBe('Zapisano raport za 2026-10-07: 7,5 h.')
  })

  it('says "raport", never "wpis"', () => {
    expect(JSON.stringify(messages).toLowerCase()).not.toContain('wpis')
  })
})
