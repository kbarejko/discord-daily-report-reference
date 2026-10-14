import { describe, expect, it } from 'vitest'

import { createDiscordClient } from './client'

const answering = (status: number, body: unknown) =>
  (async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch

describe('displayName', () => {
  it('prefers the global name and falls back to the user name', async () => {
    const both = createDiscordClient(answering(200, { username: 'kb', global_name: 'Konrad' }))
    const userOnly = createDiscordClient(answering(200, { username: 'kb', global_name: null }))
    expect(await both.displayName('1', 'token')).toBe('Konrad')
    expect(await userOnly.displayName('1', 'token')).toBe('kb')
  })

  it('returns null when Discord does not answer', async () => {
    const client = createDiscordClient(answering(404, { message: 'Unknown User' }))
    expect(await client.displayName('1', 'token')).toBeNull()
  })

  it('asks with the bot token', async () => {
    let auth: string | null = null
    const client = createDiscordClient((async (_url: string, init?: RequestInit) => {
      auth = new Headers(init?.headers).get('authorization')
      return new Response(JSON.stringify({ username: 'kb', global_name: null }))
    }) as unknown as typeof fetch)
    await client.displayName('1', 'abc')
    expect(auth).toBe('Bot abc')
  })
})
