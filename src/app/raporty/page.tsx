import type { Metadata } from 'next'

import { createDiscordClient } from '@/discord/client'
import { getEnv } from '@/env'
import { formatHours, messages } from '@/messages'
import { dayOf } from '@/reports/day'
import { getReportRepository } from '@/reports/repository'
import { teamOverview } from '@/web/team'

const t = messages.teamPage

export const metadata: Metadata = { title: t.title, robots: { index: false, follow: false } }

// Read on every request: a report saved a minute ago is on the page.
export const dynamic = 'force-dynamic'

/** Read-only, server-rendered, behind the password in src/proxy.ts (#38, D14). */
export default async function TeamPage() {
  const env = getEnv()
  const discord = createDiscordClient()
  const people = await Promise.all(
    teamOverview(await getReportRepository().listAll(), dayOf(new Date())).map(async (person) => ({
      ...person,
      name:
        (await discord.displayName(person.discordUserId, env.DISCORD_BOT_TOKEN)) ??
        person.discordUserId,
    })),
  )
  people.sort((a, b) => a.name.localeCompare(b.name, 'pl'))

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10">
      <h1 className="text-3xl font-semibold">{t.title}</h1>
      {people.length === 0 && <p className="text-zinc-500">{t.empty}</p>}

      {people.map((person) => {
        const { progress } = person
        const percent = Math.min(100, (progress.totalHours / progress.targetHours) * 100)
        return (
          <section key={person.discordUserId} className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold">{person.name}</h2>
            <div className="h-2 w-full rounded bg-zinc-200 dark:bg-zinc-800">
              <div className="h-2 rounded bg-emerald-600" style={{ width: `${percent}%` }} />
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {t.summary(progress)}
              {progress.hoursPerDayNeeded > 0 && ` · ${t.perDayNeeded(progress.hoursPerDayNeeded)}`}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-300 text-zinc-500 dark:border-zinc-700">
                  <tr>
                    <th className="py-2 pr-4">{t.columns.day}</th>
                    <th className="py-2 pr-4">{t.columns.hours}</th>
                    <th className="py-2 pr-4">{t.columns.done}</th>
                    <th className="py-2 pr-4">{t.columns.problems}</th>
                    <th className="py-2">{t.columns.plan}</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {person.reports.map((report) => (
                    <tr key={report.id} className="border-b border-zinc-200 dark:border-zinc-800">
                      <td className="whitespace-nowrap py-2 pr-4">{report.day}</td>
                      <td className="whitespace-nowrap py-2 pr-4">{formatHours(report.hours)}</td>
                      <td className="whitespace-pre-line py-2 pr-4">{report.done}</td>
                      <td className="whitespace-pre-line py-2 pr-4">{report.problems}</td>
                      <td className="whitespace-pre-line py-2">{report.plan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}
    </main>
  )
}
