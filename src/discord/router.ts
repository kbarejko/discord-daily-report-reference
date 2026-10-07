import { ping } from '@/discord/commands/ping'
import {
  type ApplicationCommandInteraction,
  type InteractionResponse,
  InteractionResponseType,
  MessageFlags,
} from '@/discord/types'

type CommandHandler = (
  interaction: ApplicationCommandInteraction,
) => InteractionResponse | Promise<InteractionResponse>

/** Command name → the function that answers it. New commands are added here. */
const handlers: Record<string, CommandHandler> = {
  ping,
}

export async function routeCommand(
  interaction: ApplicationCommandInteraction,
): Promise<InteractionResponse> {
  const handler = handlers[interaction.data.name]
  if (!handler) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `Nie znam komendy /${interaction.data.name}.`,
        flags: MessageFlags.Ephemeral,
      },
    }
  }
  return handler(interaction)
}
