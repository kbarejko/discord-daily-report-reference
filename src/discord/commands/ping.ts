import {
  type ApplicationCommandInteraction,
  type InteractionResponse,
  InteractionResponseType,
  MessageFlags,
} from '@/discord/types'

/** Answers "pong" with how long the request took, visible only to the caller. */
export function ping(
  _interaction: ApplicationCommandInteraction,
  receivedAt = Date.now(),
): InteractionResponse {
  const latencyMs = Date.now() - receivedAt
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: `pong (${latencyMs} ms)`, flags: MessageFlags.Ephemeral },
  }
}
