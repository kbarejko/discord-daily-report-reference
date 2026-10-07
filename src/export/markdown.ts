import { isWorkingDay } from '@/reports/day'
import { workingDaysBetween } from '@/reports/progress'
import type { Report } from '@/reports/types'
import { formatHours } from '@/messages'

export type ExportFile = { filename: string; content: string }

const WEEKDAYS = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota']

function weekday(day: string): string {
  return WEEKDAYS[new Date(`${day}T12:00:00Z`).getUTCDay()]
}

function allDays(from: string, to: string): string[] {
  const days: string[] = []
  const d = new Date(`${from}T12:00:00Z`)
  for (
    let day = from;
    day <= to;
    d.setUTCDate(d.getUTCDate() + 1), day = d.toISOString().slice(0, 10)
  )
    days.push(day)
  return days
}

/**
 * Reports for a range → the internship diary as Markdown (decision #27).
 * Every working day in the range appears, with "brak raportu" when nothing was
 * reported, so a gap is visible (#29). Weekends appear only when reported.
 */
export function toMarkdown(
  reports: Report[],
  range: { from: string; to: string },
  person: string,
): ExportFile {
  const byDay = new Map(reports.map((r) => [r.day, r]))
  const total = Math.round(reports.reduce((s, r) => s + r.hours, 0) * 100) / 100
  const lines = [
    `# Dziennik praktyk: ${person}`,
    '',
    `Okres: ${range.from} – ${range.to}. Dni z raportem: ${reports.length}. Razem: ${formatHours(total)}.`,
    '',
  ]
  for (const day of allDays(range.from, range.to)) {
    const r = byDay.get(day)
    if (!r && !isWorkingDay(day)) continue
    lines.push(`## ${day} (${weekday(day)})`, '')
    if (!r) {
      lines.push('_brak raportu_', '')
      continue
    }
    lines.push(`**Godziny:** ${formatHours(r.hours)}`, '', '**Co zrobiłem:**', '', r.done, '')
    if (r.problems) lines.push('**Co było trudne:**', '', r.problems, '')
    if (r.plan) lines.push('**Plan na kolejny dzień:**', '', r.plan, '')
  }
  const workingDays = workingDaysBetween(range.from, range.to).length
  lines.push(
    `---`,
    '',
    `Dni roboczych w okresie: ${workingDays}, z raportem: ${reports.filter((r) => isWorkingDay(r.day)).length}.`,
    '',
  )
  return {
    filename: `dziennik-${slug(person)}-${range.from}-${range.to}.md`,
    content: lines.join('\n'),
  }
}

function slug(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'raporty'
  )
}
