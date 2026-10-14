import { createHash, timingSafeEqual } from 'node:crypto'

/** What the proxy does with a request for the team page (#38, D14). */
export type Access = 'allow' | 'ask' | 'hidden'

/**
 * HTTP Basic Auth with one shared password; the user name is ignored.
 * No password configured → the page does not exist ('hidden'), so a deployment
 * without DASHBOARD_PASSWORD shows nothing.
 */
export function checkAccess(authorization: string | null, password: string | undefined): Access {
  if (!password) return 'hidden'
  const given = passwordFrom(authorization)
  return given !== null && sameSecret(given, password) ? 'allow' : 'ask'
}

/** "Basic base64(user:password)" → password, or null for anything else. */
function passwordFrom(authorization: string | null): string | null {
  const match = authorization?.match(/^Basic\s+(\S+)$/i)
  if (!match) return null
  const decoded = Buffer.from(match[1], 'base64').toString('utf8')
  const colon = decoded.indexOf(':')
  return colon === -1 ? null : decoded.slice(colon + 1)
}

/** Constant-time comparison: hashing first gives both sides the same length. */
function sameSecret(a: string, b: string): boolean {
  const hash = (s: string) => createHash('sha256').update(s).digest()
  return timingSafeEqual(hash(a), hash(b))
}
