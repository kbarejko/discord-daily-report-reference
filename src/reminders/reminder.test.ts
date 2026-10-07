import { describe, expect, it } from 'vitest'

import { postReminder, reminderFor } from './reminder'

describe('reminderFor', () => {
  it('mentions only the people who have not reported', () => {
    const text = reminderFor(['1', '2', '3'], ['2'], '2026-10-07')
    expect(text).toContain('<@1>')
    expect(text).toContain('<@3>')
    expect(text).not.toContain('<@2>')
    expect(text).toContain('/raport')
  })

  it('is silent when everyone reported, and when there is no team', () => {
    expect(reminderFor(['1', '2'], ['2', '1'], '2026-10-07')).toBeNull()
    expect(reminderFor([], [], '2026-10-07')).toBeNull()
  })
})

describe('postReminder', () => {
  it('posts JSON to the webhook and limits mentions to users', async () => {
    const calls: Array<{ url: string; body: unknown }> = []
    const fakeFetch = (async (url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(init.body)) })
      return new Response(null, { status: 204 })
    }) as unknown as typeof fetch
    await postReminder('https://discord.com/api/webhooks/1/abc', 'Hej <@1>', fakeFetch)
    expect(calls).toEqual([
      {
        url: 'https://discord.com/api/webhooks/1/abc',
        body: { content: 'Hej <@1>', allowed_mentions: { parse: ['users'] } },
      },
    ])
  })

  it('throws on a failed post, so the cron run shows as failed', async () => {
    const fakeFetch = (async () => new Response('bad', { status: 400 })) as unknown as typeof fetch
    await expect(postReminder('https://x', 'y', fakeFetch)).rejects.toThrow('400')
  })
})
