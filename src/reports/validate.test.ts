import { describe, expect, it } from 'vitest'

import { parseHours, validateReport } from './validate'

const good = { done: 'Zrobiłem endpoint PING', hours: '7', problems: '', plan: 'Router' }

describe('parseHours', () => {
  it.each([
    ['7', 7],
    ['7.5', 7.5],
    ['7,5', 7.5],
    ['7 h', 7],
    ['7h', 7],
    [' 0,25 ', 0.25],
  ])('accepts %s', (text, expected) => {
    expect(parseHours(text)).toBe(expected)
  })

  it.each(['', 'siedem', '7.5.1', '7:30', '-1', '1e3'])('rejects %s', (text) => {
    expect(parseHours(text)).toBeNull()
  })
})

describe('validateReport', () => {
  it('accepts a good report and trims it', () => {
    const result = validateReport({ ...good, done: '  ' + good.done + '  ' })
    expect(result).toEqual({
      ok: true,
      value: { done: good.done, hours: 7, problems: null, plan: 'Router' },
    })
  })

  it('requires at least 3 characters in done', () => {
    const result = validateReport({ ...good, done: 'ok' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors).toEqual(['Opisz, co zrobiłeś: co najmniej 3 znaki.'])
  })

  it('caps every text at 1000 characters', () => {
    const long = 'x'.repeat(1001)
    const result = validateReport({ done: long, hours: '7', problems: long, plan: long })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors).toHaveLength(3)
  })

  it('rejects hours that are not a number, with one message', () => {
    const result = validateReport({ ...good, hours: 'cały dzień' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors).toEqual(['Godziny wpisz jako liczbę, np. 7 albo 7,5.'])
  })

  it('keeps hours between 0.25 and 16', () => {
    expect(validateReport({ ...good, hours: '0' }).ok).toBe(false)
    expect(validateReport({ ...good, hours: '16' }).ok).toBe(true)
    expect(validateReport({ ...good, hours: '17' }).ok).toBe(false)
  })

  it('collects every error at once', () => {
    const result = validateReport({ done: '', hours: '' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.errors).toHaveLength(2)
  })
})
