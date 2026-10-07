import type { Context } from '@/discord/context'
import {
  type ApplicationCommandInteraction,
  ComponentType,
  type InteractionResponse,
  InteractionResponseType,
  type ModalSubmitInteraction,
  MessageFlags,
  optionOf,
  type TextInput,
  TextInputStyle,
  userOf,
} from '@/discord/types'
import { messages } from '@/messages'
import { dayOf } from '@/reports/day'
import { limits, validateReport } from '@/reports/validate'

export const RAPORT_MODAL = 'raport'
/** A report older than this many days is the mentor's to fix (decision #31). */
export const MAX_DAYS_BACK = 7
const DAY = /^\d{4}-\d{2}-\d{2}$/

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86_400_000)
}

/** The day a report may be about: today by default, an earlier day on request, never the future or too far back. */
export function resolveDay(
  option: string | undefined,
  today: string,
): { ok: true; day: string } | { ok: false; error: string } {
  if (option === undefined) return { ok: true, day: today }
  if (!DAY.test(option) || Number.isNaN(Date.parse(`${option}T12:00:00Z`)))
    return { ok: false, error: messages.raportDay.badDate }
  if (option > today) return { ok: false, error: messages.raportDay.future(option) }
  if (daysBetween(option, today) > MAX_DAYS_BACK)
    return { ok: false, error: messages.raportDay.tooOld(option, MAX_DAYS_BACK) }
  return { ok: true, day: option }
}

/** The modal's custom_id carries the day, so the submit handler knows which day it is about. */
export function modalId(day: string): string {
  return `${RAPORT_MODAL}:${day}`
}

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
  const resolved = resolveDay(optionOf(interaction, 'dzien'), dayOf(ctx.now()))
  if (!resolved.ok) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: resolved.error, flags: MessageFlags.Ephemeral },
    }
  }
  const day = resolved.day
  const existing = await ctx.reports.findByUserAndDay(userOf(interaction).id, day)
  const f = messages.form
  return {
    type: InteractionResponseType.Modal,
    data: {
      custom_id: modalId(day),
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
  // The day travels in the custom_id ("raport:2026-10-06"); a bare "raport" means today.
  const day = interaction.data.custom_id.split(':')[1] ?? dayOf(ctx.now())
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
