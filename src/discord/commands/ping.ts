import { type InteractionResponse, InteractionResponseType, MessageFlags } from '@/discord/types'
import { messages } from '@/messages'

/** Answers "pong" with how long the request took, visible only to the caller. */
export function ping(_interaction: unknown, receivedAt = Date.now()): InteractionResponse {
  const latencyMs = Date.now() - receivedAt
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: messages.pong(latencyMs), flags: MessageFlags.Ephemeral },
  }
}
