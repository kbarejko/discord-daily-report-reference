import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

/** One row per report. D7 (one report per person per day) is the unique index, not only code. */
export const reports = sqliteTable(
  'reports',
  {
    id: text('id').primaryKey(),
    discordUserId: text('discord_user_id').notNull(),
    /** Local day in Europe/Warsaw, YYYY-MM-DD (D6). Text, so it sorts and compares as a string. */
    day: text('day').notNull(),
    done: text('done').notNull(),
    hours: real('hours').notNull(),
    problems: text('problems'),
    plan: text('plan'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (t) => [
    uniqueIndex('reports_user_day').on(t.discordUserId, t.day),
    index('reports_day').on(t.day),
  ],
)
