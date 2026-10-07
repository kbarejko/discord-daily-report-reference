import { describe, expect, it } from 'vitest'

import { parseEnv } from './env'

const valid = {
  DISCORD_APPLICATION_ID: '123',
  DISCORD_PUBLIC_KEY: 'abc',
  DISCORD_BOT_TOKEN: 'token',
  DISCORD_GUILD_ID: '456',
  CRON_SECRET: 'secret',
  REMINDER_WEBHOOK_URL: 'https://discord.com/api/webhooks/1/abc',
}

describe('parseEnv', () => {
  it('accepts a complete environment and fills the default database URL', () => {
    const env = parseEnv(valid)
    expect(env.DISCORD_PUBLIC_KEY).toBe('abc')
    expect(env.DATABASE_URL).toBe('file:./data/reports.db')
    expect(env.DATABASE_AUTH_TOKEN).toBeUndefined()
  })

  it('names the missing variable', () => {
    expect(() => parseEnv({ ...valid, DISCORD_PUBLIC_KEY: undefined })).toThrow(
      'DISCORD_PUBLIC_KEY',
    )
  })

  it('splits the team ids and tolerates spaces and an empty value', () => {
    expect(parseEnv({ ...valid, REPORT_TEAM_USER_IDS: ' 1, 2 ,,3 ' }).REPORT_TEAM_USER_IDS).toEqual(
      ['1', '2', '3'],
    )
    expect(parseEnv(valid).REPORT_TEAM_USER_IDS).toEqual([])
  })

  it('accepts an empty optional variable, as .env.example ships it', () => {
    expect(parseEnv({ ...valid, DATABASE_AUTH_TOKEN: '' }).DATABASE_AUTH_TOKEN).toBeUndefined()
  })

  it('treats an empty string as missing', () => {
    expect(() => parseEnv({ ...valid, DISCORD_BOT_TOKEN: '' })).toThrow('DISCORD_BOT_TOKEN')
  })
})
