import { timingSafeEqual } from 'node:crypto'

import { getEnv } from '@/env'
import { dayOf, isWorkingDay } from '@/reports/day'
import { getReportRepository } from '@/reports/repository'
import { postReminder, reminderFor } from '@/reminders/reminder'

/** Constant-time comparison, so a wrong secret takes as long as a right one. */
function authorized(header: string | null, secret: string): boolean {
  const given = Buffer.from(header ?? '')
  const expected = Buffer.from(`Bearer ${secret}`)
  return given.length === expected.length && timingSafeEqual(given, expected)
}

/**
 * Called by Vercel Cron (vercel.json) on working days around 15:00 Warsaw time (D9).
 * Posts one message naming who has not reported today, through the channel webhook (D13).
 */
export async function GET(request: Request): Promise<Response> {
  const env = getEnv()
  if (!authorized(request.headers.get('authorization'), env.CRON_SECRET)) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }
  const today = dayOf(new Date())
  if (!isWorkingDay(today)) return Response.json({ posted: false, reason: 'weekend', today })
  const reported = await getReportRepository().listUserIdsWithReport(today)
  const content = reminderFor(env.REPORT_TEAM_USER_IDS, reported, today)
  if (!content) return Response.json({ posted: false, reason: 'everyone reported', today })
  await postReminder(env.REMINDER_WEBHOOK_URL, content)
  return Response.json({
    posted: true,
    missing: env.REPORT_TEAM_USER_IDS.length - reported.length,
    today,
  })
}
