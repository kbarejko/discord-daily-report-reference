import type { Context } from '@/discord/context'
import {
  type ApplicationCommandInteraction,
  type InteractionResponse,
  InteractionResponseType,
  MessageFlags,
  optionOf,
  userOf,
} from '@/discord/types'
import { toMarkdown } from '@/export/markdown'
import { messages } from '@/messages'
import { dayOf } from '@/reports/day'

const DAY = /^\d{4}-\d{2}-\d{2}$/
/** The internship started on 5 October 2026 (README). */
export const INTERNSHIP_START = '2026-10-05'

/**
 * /eksport [od] [do]: the diary as a Markdown file. Building it can take longer
 * than Discord's 3 seconds, so the reply is deferred (type 5) and the file
 * arrives through the follow-up webhook (D3), after the response was sent.
 */
export async function eksport(
  interaction: ApplicationCommandInteraction,
  ctx: Context,
): Promise<InteractionResponse> {
  const from = optionOf(interaction, 'od') ?? INTERNSHIP_START
  const to = optionOf(interaction, 'do') ?? dayOf(ctx.now())
  if (!DAY.test(from) || !DAY.test(to) || from > to) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: messages.export.badRange, flags: MessageFlags.Ephemeral },
    }
  }
  const user = userOf(interaction)
  ctx.defer(async () => {
    const reports = await ctx.reports.listByUser(user.id, { from, to })
    const file = toMarkdown(reports, { from, to }, user.username)
    const content =
      reports.length === 0
        ? messages.export.empty(from, to)
        : messages.export.ready(from, to, reports.length)
    await ctx.discord.followUp(ctx.applicationId, interaction.token, { content, file })
  })
  return {
    type: InteractionResponseType.DeferredChannelMessageWithSource,
    data: { flags: MessageFlags.Ephemeral },
  }
}
