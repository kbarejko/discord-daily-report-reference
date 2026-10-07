import { describe, expect, it } from 'vitest'

import { dayOf, isWorkingDay } from './day'

describe('dayOf', () => {
  it('is already the next day in Warsaw at 23:30 UTC', () => {
    expect(dayOf(new Date('2026-10-07T23:30:00Z'))).toBe('2026-10-08')
  })

  it('switches exactly at Warsaw midnight', () => {
    expect(dayOf(new Date('2026-10-07T21:59:59Z'))).toBe('2026-10-07')
    expect(dayOf(new Date('2026-10-07T22:00:00Z'))).toBe('2026-10-08')
  })

  it('handles the night the clocks go back (25 October 2026)', () => {
    expect(dayOf(new Date('2026-10-24T22:30:00Z'))).toBe('2026-10-25')
    expect(dayOf(new Date('2026-10-25T22:30:00Z'))).toBe('2026-10-25')
    expect(dayOf(new Date('2026-10-25T23:00:00Z'))).toBe('2026-10-26')
  })
})

describe('isWorkingDay', () => {
  it('knows the weekend', () => {
    expect(isWorkingDay('2026-10-09')).toBe(true) // Friday
    expect(isWorkingDay('2026-10-10')).toBe(false) // Saturday
    expect(isWorkingDay('2026-10-11')).toBe(false) // Sunday
    expect(isWorkingDay('2026-10-12')).toBe(true) // Monday
  })
})
