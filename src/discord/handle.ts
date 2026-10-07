import type { Context } from '@/discord/context'
import { routeCommand, routeModal } from '@/discord/router'
import {
  type Interaction,
  type InteractionResponse,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from '@/discord/types'
import { messages } from '@/messages'

/**
 * One verified interaction in, one response out. Any error inside a handler is
 * logged with the interaction id and turned into a short ephemeral message (#22):
 * the user never sees a stack trace, the developer sees it in the logs.
 */
export async function handleInteraction(
  interaction: Interaction,
  ctx: Context,
): Promise<InteractionResponse> {
  if (interaction.type === InteractionType.Ping) return { type: InteractionResponseType.Pong }
  try {
    if (interaction.type === InteractionType.ApplicationCommand)
      return await routeCommand(interaction, ctx)
    return await routeModal(interaction, ctx)
  } catch (error) {
    console.error(`[interaction ${interaction.id}]`, error)
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: messages.somethingWentWrong, flags: MessageFlags.Ephemeral },
    }
  }
}
