/** Only the parts of Discord's Interactions API that this bot reads or sends (architecture §5). */

export const InteractionType = {
  Ping: 1,
  ApplicationCommand: 2,
  ModalSubmit: 5,
} as const

export const InteractionResponseType = {
  Pong: 1,
  ChannelMessageWithSource: 4,
  DeferredChannelMessageWithSource: 5,
  Modal: 9,
} as const

/** `flags: 64` makes a reply visible only to the person who typed the command (D8). */
export const MessageFlags = { Ephemeral: 64 } as const

type DiscordUser = { id: string; username: string }

export type PingInteraction = { type: typeof InteractionType.Ping }

export type ApplicationCommandInteraction = {
  type: typeof InteractionType.ApplicationCommand
  id: string
  token: string
  data: { name: string }
  /** Present on a server; `user` is present in direct messages. */
  member?: { user: DiscordUser }
  user?: DiscordUser
}

export type ModalSubmitInteraction = {
  type: typeof InteractionType.ModalSubmit
  id: string
  token: string
  data: {
    custom_id: string
    components: Array<{ components: Array<{ custom_id: string; value: string }> }>
  }
  member?: { user: DiscordUser }
  user?: DiscordUser
}

export type Interaction = PingInteraction | ApplicationCommandInteraction | ModalSubmitInteraction

export type Embed = {
  title?: string
  description?: string
  fields?: Array<{ name: string; value: string; inline?: boolean }>
}

export type MessageResponse = {
  type:
    | typeof InteractionResponseType.ChannelMessageWithSource
    | typeof InteractionResponseType.DeferredChannelMessageWithSource
  data?: { content?: string; flags?: number; embeds?: Embed[] }
}

/** Component types and text input styles used in modals. */
export const ComponentType = { ActionRow: 1, TextInput: 4 } as const
export const TextInputStyle = { Short: 1, Paragraph: 2 } as const

export type TextInput = {
  type: typeof ComponentType.TextInput
  custom_id: string
  label: string
  style: (typeof TextInputStyle)[keyof typeof TextInputStyle]
  required?: boolean
  min_length?: number
  max_length?: number
  placeholder?: string
  value?: string
}

export type ModalResponse = {
  type: typeof InteractionResponseType.Modal
  data: {
    custom_id: string
    title: string
    components: Array<{ type: typeof ComponentType.ActionRow; components: [TextInput] }>
  }
}

export type InteractionResponse =
  { type: typeof InteractionResponseType.Pong } | MessageResponse | ModalResponse

/** The user behind an interaction, whether it came from a server or a DM. */
export function userOf(
  interaction: ApplicationCommandInteraction | ModalSubmitInteraction,
): DiscordUser {
  const user = interaction.member?.user ?? interaction.user
  if (!user) throw new Error('Interaction without a user')
  return user
}
