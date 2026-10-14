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
import { dayOf, isRealDay } from '@/reports/day'

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
  if (!isRealDay(from) || !isRealDay(to) || from > to) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: messages.export.badRange, flags: MessageFlags.Ephemeral },
    }
  }
  const user = userOf(interaction)
  ctx.defer(async () => {
    try {
      const reports = await ctx.reports.listByUser(user.id, { from, to })
      const file = toMarkdown(reports, { from, to }, user.username)
      const content =
        reports.length === 0
          ? messages.export.empty(from, to)
          : messages.export.ready(from, to, reports.length)
      await ctx.discord.followUp(ctx.applicationId, interaction.token, { content, file })
    } catch (error) {
      // The response is already sent, so handleInteraction (#22) cannot catch this:
      // without a follow-up the caller would stare at "thinking…" forever.
      console.error(`[interaction ${interaction.id}]`, error)
      await ctx.discord
        .followUp(ctx.applicationId, interaction.token, { content: messages.somethingWentWrong })
        .catch((followUpError) => console.error(`[interaction ${interaction.id}]`, followUpError))
    }
  })
  return {
    type: InteractionResponseType.DeferredChannelMessageWithSource,
    data: { flags: MessageFlags.Ephemeral },
  }
}
