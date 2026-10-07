import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import type { Report } from '@/reports/types'

import { toMarkdown } from './markdown'

const report = (day: string, hours: number, done: string, extra: Partial<Report> = {}): Report => ({
  id: day,
  discordUserId: 'u1',
  day,
  done,
  hours,
  problems: null,
  plan: null,
  createdAt: new Date(0),
  updatedAt: new Date(0),
  ...extra,
})

/** The sample reviewed in #27: Mon 5 – Fri 9 October, Tuesday missing, Thursday with problems and a plan. */
export const sampleReports = [
  report('2026-10-05', 7, 'Komputer, konta, pierwszy pull request.'),
  report('2026-10-07', 7.5, 'Endpoint PING i podpis Ed25519.\nRouter z /ping.', {
    problems: 'TypeScript 6 i Uint8Array jako BufferSource.',
    plan: 'Formularz /raport.',
  }),
  report('2026-10-08', 8, 'Formularz /raport i zapis do SQLite.'),
  report('2026-10-09', 6, '/moje-raporty i obsługa błędów.'),
]

describe('toMarkdown', () => {
  it('matches the sample reviewed in #27', () => {
    const file = toMarkdown(
      sampleReports,
      { from: '2026-10-05', to: '2026-10-11' },
      'Anna Kowalska',
    )
    expect(file.filename).toBe('dziennik-anna-kowalska-2026-10-05-2026-10-11.md')
    expect(file.content).toBe(readFileSync('docs/export-sample.md', 'utf8'))
  })

  it('shows a working day without a report, hides an unreported weekend', () => {
    const file = toMarkdown([], { from: '2026-10-09', to: '2026-10-12' }, 'x')
    expect(file.content).toContain('## 2026-10-09 (piątek)\n\n_brak raportu_')
    expect(file.content).not.toContain('2026-10-10')
    expect(file.content).toContain('## 2026-10-12 (poniedziałek)')
  })

  it('includes a reported weekend day', () => {
    const file = toMarkdown(
      [report('2026-10-10', 2, 'Sobota')],
      { from: '2026-10-10', to: '2026-10-10' },
      'x',
    )
    expect(file.content).toContain('## 2026-10-10 (sobota)')
  })
})
