import { getEnv } from '@/env'
import { routeCommand } from '@/discord/router'
import { type Interaction, InteractionResponseType, InteractionType } from '@/discord/types'
import { verifySignature } from '@/discord/verify'

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

  if (interaction.type === InteractionType.Ping) {
    return Response.json({ type: InteractionResponseType.Pong })
  }
  if (interaction.type === InteractionType.ApplicationCommand) {
    return Response.json(await routeCommand(interaction))
  }
  return Response.json({ error: 'unsupported interaction type' }, { status: 400 })
}
