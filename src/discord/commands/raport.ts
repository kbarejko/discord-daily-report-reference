import type { Context } from '@/discord/context'
import {
  type ApplicationCommandInteraction,
  ComponentType,
  type InteractionResponse,
  InteractionResponseType,
  type ModalSubmitInteraction,
  MessageFlags,
  type TextInput,
  TextInputStyle,
  userOf,
} from '@/discord/types'
import { messages } from '@/messages'
import { dayOf } from '@/reports/day'
import { limits, validateReport } from '@/reports/validate'

export const RAPORT_MODAL = 'raport'

function input(partial: Omit<TextInput, 'type'>): { type: 1; components: [TextInput] } {
  return {
    type: ComponentType.ActionRow,
    components: [{ type: ComponentType.TextInput, ...partial }],
  }
}

/** /raport: opens the form, pre-filled when today's report already exists (D7). */
export async function raport(
  interaction: ApplicationCommandInteraction,
  ctx: Context,
): Promise<InteractionResponse> {
  const day = dayOf(ctx.now())
  const existing = await ctx.reports.findByUserAndDay(userOf(interaction).id, day)
  const f = messages.form
  return {
    type: InteractionResponseType.Modal,
    data: {
      custom_id: RAPORT_MODAL,
      title: f.title(day),
      components: [
        input({
          custom_id: 'done',
          label: f.done,
          style: TextInputStyle.Paragraph,
          required: true,
          min_length: limits.doneMin,
          max_length: limits.textMax,
          placeholder: f.donePlaceholder,
          value: existing?.done,
        }),
        input({
          custom_id: 'hours',
          label: f.hours,
          style: TextInputStyle.Short,
          required: true,
          max_length: 6,
          placeholder: f.hoursPlaceholder,
          value: existing ? String(existing.hours).replace('.', ',') : undefined,
        }),
        input({
          custom_id: 'problems',
          label: f.problems,
          style: TextInputStyle.Paragraph,
          required: false,
          max_length: limits.textMax,
          value: existing?.problems ?? undefined,
        }),
        input({
          custom_id: 'plan',
          label: f.plan,
          style: TextInputStyle.Paragraph,
          required: false,
          max_length: limits.textMax,
          value: existing?.plan ?? undefined,
        }),
      ],
    },
  }
}

/** Reads the submitted fields by custom_id, never by position. */
export function fieldsOf(interaction: ModalSubmitInteraction): Record<string, string> {
  const out: Record<string, string> = {}
  for (const row of interaction.data.components)
    for (const c of row.components) out[c.custom_id] = c.value
  return out
}

/** The submitted form: validate, save, confirm; or list what to fix and save nothing. */
export async function saveRaport(
  interaction: ModalSubmitInteraction,
  ctx: Context,
): Promise<InteractionResponse> {
  const fields = fieldsOf(interaction)
  const result = validateReport({
    done: fields.done ?? '',
    hours: fields.hours ?? '',
    problems: fields.problems,
    plan: fields.plan,
  })
  if (!result.ok) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: [messages.notSaved, ...result.errors.map((e) => `• ${e}`)].join('\n'),
        flags: MessageFlags.Ephemeral,
      },
    }
  }
  const day = dayOf(ctx.now())
  const userId = userOf(interaction).id
  const replaced = (await ctx.reports.findByUserAndDay(userId, day)) !== null
  const saved = await ctx.reports.upsert({ discordUserId: userId, day, ...result.value })
  const lines = [
    messages.saved(saved.day, saved.hours),
    replaced ? messages.savedReplaced : null,
    '',
    saved.done,
  ]
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: lines.filter((l) => l !== null).join('\n'), flags: MessageFlags.Ephemeral },
  }
}
