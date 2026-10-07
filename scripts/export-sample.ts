/** Writes docs/export-sample.md from the sample in the export test (#27). Run with tsx. */
import { writeFileSync } from 'node:fs'

import { toMarkdown } from '../src/export/markdown'
import type { Report } from '../src/reports/types'

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
const sample = [
  report('2026-10-05', 7, 'Komputer, konta, pierwszy pull request.'),
  report('2026-10-07', 7.5, 'Endpoint PING i podpis Ed25519.\nRouter z /ping.', {
    problems: 'TypeScript 6 i Uint8Array jako BufferSource.',
    plan: 'Formularz /raport.',
  }),
  report('2026-10-08', 8, 'Formularz /raport i zapis do SQLite.'),
  report('2026-10-09', 6, '/moje-raporty i obsługa błędów.'),
]
writeFileSync(
  'docs/export-sample.md',
  toMarkdown(sample, { from: '2026-10-05', to: '2026-10-11' }, 'Anna Kowalska').content,
)
console.log('docs/export-sample.md written')
