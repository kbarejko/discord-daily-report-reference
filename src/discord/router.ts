import type { Context } from '@/discord/context'
import { ping } from '@/discord/commands/ping'
import { raport } from '@/discord/commands/raport'
import {
  type ApplicationCommandInteraction,
  type InteractionResponse,
  InteractionResponseType,
  MessageFlags,
} from '@/discord/types'
import { messages } from '@/messages'

type CommandHandler = (
  interaction: ApplicationCommandInteraction,
  ctx: Context,
) => InteractionResponse | Promise<InteractionResponse>

/** Command name → the function that answers it. New commands are added here. */
const commands: Record<string, CommandHandler> = {
  ping,
  raport,
}

function unknown(name: string): InteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: messages.unknownCommand(name), flags: MessageFlags.Ephemeral },
  }
}

export async function routeCommand(
  interaction: ApplicationCommandInteraction,
  ctx: Context,
): Promise<InteractionResponse> {
  const handler = commands[interaction.data.name]
  return handler ? handler(interaction, ctx) : unknown(interaction.data.name)
}
