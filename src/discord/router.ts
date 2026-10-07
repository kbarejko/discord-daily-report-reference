import type { Context } from '@/discord/context'
import { mojeRaporty } from '@/discord/commands/moje-raporty'
import { ping } from '@/discord/commands/ping'
import { postep } from '@/discord/commands/postep'
import { RAPORT_MODAL, raport, saveRaport } from '@/discord/commands/raport'
import {
  type ApplicationCommandInteraction,
  type InteractionResponse,
  InteractionResponseType,
  MessageFlags,
  type ModalSubmitInteraction,
} from '@/discord/types'
import { messages } from '@/messages'

type CommandHandler = (
  interaction: ApplicationCommandInteraction,
  ctx: Context,
) => InteractionResponse | Promise<InteractionResponse>
type ModalHandler = (
  interaction: ModalSubmitInteraction,
  ctx: Context,
) => InteractionResponse | Promise<InteractionResponse>

/** Command name → the function that answers it. New commands are added here. */
const commands: Record<string, CommandHandler> = {
  ping,
  raport,
  'moje-raporty': mojeRaporty,
  postep,
}

/** Modal custom_id → the function that handles the submitted form. */
const modals: Record<string, ModalHandler> = {
  [RAPORT_MODAL]: saveRaport,
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

export async function routeModal(
  interaction: ModalSubmitInteraction,
  ctx: Context,
): Promise<InteractionResponse> {
  const handler = modals[interaction.data.custom_id]
  return handler ? handler(interaction, ctx) : unknown(interaction.data.custom_id)
}
