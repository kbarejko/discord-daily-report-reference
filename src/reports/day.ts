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

/** Monday to Friday. `day` is "YYYY-MM-DD". */
export function isWorkingDay(day: string): boolean {
  const weekday = new Date(`${day}T12:00:00Z`).getUTCDay()
  return weekday >= 1 && weekday <= 5
}
