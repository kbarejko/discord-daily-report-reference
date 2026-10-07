import { z } from 'zod'

/**
 * Every setting the app needs, read once from process.env and checked.
 * A missing key stops the app at startup with the key's name (D10).
 * Server-only: import it from route handlers and scripts, never from a page.
 */
const schema = z.object({
  DISCORD_APPLICATION_ID: z.string().min(1),
  DISCORD_PUBLIC_KEY: z.string().min(1),
  DISCORD_BOT_TOKEN: z.string().min(1),
  DISCORD_GUILD_ID: z.string().min(1),
  DATABASE_URL: z.string().min(1).default('file:./data/reports.db'),
  DATABASE_AUTH_TOKEN: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(1),
  /** Webhook of the channel the 15:00 reminder is posted to (D13). */
  REMINDER_WEBHOOK_URL: z.string().url(),
  /** Discord user ids expected to report every working day, comma-separated. Empty: no reminders. */
  REPORT_TEAM_USER_IDS: z
    .string()
    .optional()
    .transform((value) =>
      (value ?? '')
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean),
    ),
})

export type Env = z.infer<typeof schema>

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = schema.safeParse(source)
  if (!result.success) {
    const names = result.error.issues.map((issue) => issue.path.join('.')).join(', ')
    throw new Error(`Missing or empty environment variables: ${names}`)
  }
  return result.data
}

let cached: Env | undefined

/** The checked settings. Read lazily, so importing this file in a test does not need a real .env. */
export function getEnv(): Env {
  cached ??= parseEnv(process.env)
  return cached
}
