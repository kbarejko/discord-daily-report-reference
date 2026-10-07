import { beforeAll, describe, expect, it } from 'vitest'

import { hexToBytes, verifySignature } from './verify'

function bytesToHex(bytes: ArrayBuffer | Uint8Array): string {
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('')
}

let publicKey = ''
let privateKey: CryptoKey

async function sign(timestamp: string, body: string): Promise<string> {
  const message = new TextEncoder().encode(timestamp + body)
  return bytesToHex(await crypto.subtle.sign('Ed25519', privateKey, message))
}

beforeAll(async () => {
  const pair = (await crypto.subtle.generateKey({ name: 'Ed25519' }, true, [
    'sign',
    'verify',
  ])) as CryptoKeyPair
  privateKey = pair.privateKey
  publicKey = bytesToHex(await crypto.subtle.exportKey('raw', pair.publicKey))
})

describe('hexToBytes', () => {
  it('decodes two characters per byte', () => {
    expect(Array.from(hexToBytes('00ff10'))).toEqual([0, 255, 16])
  })
})

describe('verifySignature', () => {
  const body = '{"type":1}'
  const timestamp = '1700000000'

  it('accepts a body signed with the matching key', async () => {
    const signature = await sign(timestamp, body)
    expect(await verifySignature({ body, signature, timestamp, publicKey })).toBe(true)
  })

  it('rejects a changed body', async () => {
    const signature = await sign(timestamp, body)
    expect(await verifySignature({ body: '{"type":2}', signature, timestamp, publicKey })).toBe(
      false,
    )
  })

  it('rejects a changed timestamp', async () => {
    const signature = await sign(timestamp, body)
    expect(await verifySignature({ body, signature, timestamp: '1700000001', publicKey })).toBe(
      false,
    )
  })

  it('rejects another key', async () => {
    const other = (await crypto.subtle.generateKey({ name: 'Ed25519' }, true, [
      'sign',
      'verify',
    ])) as CryptoKeyPair
    const otherKey = bytesToHex(await crypto.subtle.exportKey('raw', other.publicKey))
    const signature = await sign(timestamp, body)
    expect(await verifySignature({ body, signature, timestamp, publicKey: otherKey })).toBe(false)
  })

  it('returns false instead of throwing on garbage', async () => {
    expect(await verifySignature({ body, signature: 'zz', timestamp, publicKey: 'not-hex' })).toBe(
      false,
    )
  })
})
