import { beforeAll, describe, expect, it, vi } from 'vitest'

beforeAll(() => {
  vi.stubEnv('DISCORD_APPLICATION_ID', '1')
  vi.stubEnv('DISCORD_PUBLIC_KEY', 'k')
  vi.stubEnv('DISCORD_BOT_TOKEN', 't')
  vi.stubEnv('DISCORD_GUILD_ID', '1')
  vi.stubEnv('CRON_SECRET', 'top-secret')
  vi.stubEnv('REMINDER_WEBHOOK_URL', 'https://discord.com/api/webhooks/1/abc')
  vi.stubEnv('DATABASE_URL', ':memory:')
})

describe('GET /api/cron/reminders', () => {
  it('refuses a missing or wrong secret with 401, before touching anything', async () => {
    const { GET } = await import('./route')
    expect((await GET(new Request('http://x/api/cron/reminders'))).status).toBe(401)
    expect(
      (
        await GET(
          new Request('http://x/api/cron/reminders', { headers: { authorization: 'Bearer nope' } }),
        )
      ).status,
    ).toBe(401)
    expect(
      (
        await GET(
          new Request('http://x/api/cron/reminders', {
            headers: { authorization: 'Bearer top-secre' },
          }),
        )
      ).status,
    ).toBe(401)
  })
})
