/** Turns "a1b2…" (hex, as Discord shows the key) into bytes. */
export function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(hex.length / 2))
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

type VerifyInput = {
  /** The raw request body, exactly as received. */
  body: string
  /** Header X-Signature-Ed25519 (hex). */
  signature: string
  /** Header X-Signature-Timestamp. */
  timestamp: string
  /** The application's public key from the Developer Portal (hex). */
  publicKey: string
}

/** True when Discord signed timestamp + body with the key behind `publicKey` (D2). */
export async function verifySignature({
  body,
  signature,
  timestamp,
  publicKey,
}: VerifyInput): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      hexToBytes(publicKey),
      { name: 'Ed25519' },
      false,
      ['verify'],
    )
    const message = new TextEncoder().encode(timestamp + body)
    return await crypto.subtle.verify('Ed25519', key, hexToBytes(signature), message)
  } catch {
    return false
  }
}
