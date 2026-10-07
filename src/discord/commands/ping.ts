import { type InteractionResponse, InteractionResponseType, MessageFlags } from '@/discord/types'
import { messages } from '@/messages'

/** Answers "pong" with how long the handler took, visible only to the caller. */
export function ping(): InteractionResponse {
  const startedAt = Date.now()
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: messages.pong(Date.now() - startedAt), flags: MessageFlags.Ephemeral },
  }
}
