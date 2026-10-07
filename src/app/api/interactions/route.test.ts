import { beforeAll, describe, expect, it, vi } from 'vitest'

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('')
}

let privateKey: CryptoKey
let publicKey = ''

beforeAll(async () => {
  const pair = (await crypto.subtle.generateKey({ name: 'Ed25519' }, true, [
    'sign',
    'verify',
  ])) as CryptoKeyPair
  privateKey = pair.privateKey
  publicKey = bytesToHex(await crypto.subtle.exportKey('raw', pair.publicKey))
  // The route reads env at import time, so set the key before importing it.
  vi.stubEnv('DISCORD_APPLICATION_ID', '1')
  vi.stubEnv('DISCORD_PUBLIC_KEY', publicKey)
  vi.stubEnv('DISCORD_BOT_TOKEN', 't')
  vi.stubEnv('DISCORD_GUILD_ID', '1')
  vi.stubEnv('CRON_SECRET', 's')
  vi.stubEnv('REMINDER_WEBHOOK_URL', 'https://discord.com/api/webhooks/1/abc')
})

async function post(body: string, signed: boolean): Promise<Response> {
  const { POST } = await import('./route')
  const timestamp = '1700000000'
  const headers: Record<string, string> = { 'X-Signature-Timestamp': timestamp }
  if (signed) {
    const message = new TextEncoder().encode(timestamp + body)
    headers['X-Signature-Ed25519'] = bytesToHex(
      await crypto.subtle.sign('Ed25519', privateKey, message),
    )
  }
  return POST(new Request('http://localhost/api/interactions', { method: 'POST', body, headers }))
}

describe('POST /api/interactions', () => {
  it('answers a signed PING with PONG', async () => {
    const response = await post('{"type":1}', true)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ type: 1 })
  })

  it('rejects an unsigned request with 401', async () => {
    const response = await post('{"type":1}', false)
    expect(response.status).toBe(401)
  })
})
