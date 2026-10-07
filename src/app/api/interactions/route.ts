import { getEnv } from '@/env'
import type { Context } from '@/discord/context'
import { handleInteraction } from '@/discord/handle'
import type { Interaction } from '@/discord/types'
import { verifySignature } from '@/discord/verify'
import { getReportRepository } from '@/reports/repository'

/** Discord sends every interaction here as a signed POST (architecture §2). */
export async function POST(request: Request): Promise<Response> {
  // The signature covers the raw text, so read it before any JSON parsing.
  const body = await request.text()
  const signature = request.headers.get('X-Signature-Ed25519') ?? ''
  const timestamp = request.headers.get('X-Signature-Timestamp') ?? ''

  const valid = await verifySignature({
    body,
    signature,
    timestamp,
    publicKey: getEnv().DISCORD_PUBLIC_KEY,
  })
  if (!valid) return Response.json({ error: 'invalid request signature' }, { status: 401 })

  const interaction = JSON.parse(body) as Interaction
  // The only place that knows which repository the app uses (#20).
  const ctx: Context = { reports: getReportRepository(), now: () => new Date() }
  return Response.json(await handleInteraction(interaction, ctx))
}
