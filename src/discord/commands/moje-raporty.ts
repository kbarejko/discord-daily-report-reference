import type { Context } from '@/discord/context'
import {
  type ApplicationCommandInteraction,
  type InteractionResponse,
  InteractionResponseType,
  MessageFlags,
  userOf,
} from '@/discord/types'
import { messages } from '@/messages'
import { dayOf } from '@/reports/day'

const MAX_REPORTS = 7
/** Discord caps an embed field value at 1024 characters; one line of "done" needs far less. */
const MAX_LINE = 200

export function firstLine(text: string): string {
  const line = text.split('\n')[0].trim()
  return line.length > MAX_LINE ? line.slice(0, MAX_LINE - 1) + '…' : line
}

/** /moje-raporty: your last 7 reports, newest first, only you see them. */
export async function mojeRaporty(
  interaction: ApplicationCommandInteraction,
  ctx: Context,
): Promise<InteractionResponse> {
  const all = await ctx.reports.listByUser(userOf(interaction).id, {
    from: '0000-01-01',
    to: dayOf(ctx.now()),
  })
  const latest = all.slice(-MAX_REPORTS).reverse()
  if (latest.length === 0) {
    return {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: messages.myReports.empty, flags: MessageFlags.Ephemeral },
    }
  }
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      flags: MessageFlags.Ephemeral,
      embeds: [
        {
          title: messages.myReports.title,
          fields: latest.map((r) => ({
            name: messages.myReports.line(r.day, r.hours),
            value: firstLine(r.done),
          })),
        },
      ],
    },
  }
}
