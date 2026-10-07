import { getEnv } from '@/env'
import type { Context } from '@/discord/context'
import { routeCommand, routeModal } from '@/discord/router'
import { type Interaction, InteractionResponseType, InteractionType } from '@/discord/types'
import { verifySignature } from '@/discord/verify'
import { MemoryReportRepository } from '@/reports/memory-repository'

// Until #20 wires the SQLite repository, the app keeps reports in memory.
const reports = new MemoryReportRepository()

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
  if (!valid) {
    return Response.json({ error: 'invalid request signature' }, { status: 401 })
  }

  const interaction = JSON.parse(body) as Interaction
  const ctx: Context = { reports, now: () => new Date() }

  if (interaction.type === InteractionType.Ping) {
    return Response.json({ type: InteractionResponseType.Pong })
  }
  if (interaction.type === InteractionType.ApplicationCommand) {
    return Response.json(await routeCommand(interaction, ctx))
  }
  return Response.json(await routeModal(interaction, ctx))
}
