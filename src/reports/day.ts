/** Formats any moment as the calendar day in Warsaw, e.g. "2026-10-25" (D6). */
const warsawDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Warsaw',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function dayOf(date: Date): string {
  return warsawDay.format(date)
}

/**
 * "YYYY-MM-DD" that is a real calendar day. The shape alone is not enough:
 * Date turns "2026-09-31" into 1 October instead of failing, so the day must
 * print back as the same text.
 */
export function isRealDay(text: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false
  const date = new Date(`${text}T12:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === text
}

/** Monday to Friday. `day` is "YYYY-MM-DD". */
export function isWorkingDay(day: string): boolean {
  const weekday = new Date(`${day}T12:00:00Z`).getUTCDay()
  return weekday >= 1 && weekday <= 5
}
