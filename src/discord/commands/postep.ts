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
import { progressOf } from '@/reports/progress'

const BAR_WIDTH = 10

/** `▓▓▓▓▓▓░░░░` for 60 %. */
export function bar(done: number, target: number, width = BAR_WIDTH): string {
  const filled = Math.min(width, Math.round((done / target) * width))
  return '▓'.repeat(filled) + '░'.repeat(width - filled)
}

/** /postep: hours so far against the 140-hour internship, only you see it. No arithmetic here (#25). */
export async function postep(
  interaction: ApplicationCommandInteraction,
  ctx: Context,
): Promise<InteractionResponse> {
  const today = dayOf(ctx.now())
  const reports = await ctx.reports.listByUser(userOf(interaction).id, {
    from: '0000-01-01',
    to: today,
  })
  const p = progressOf(reports, today)
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: messages.progress(bar(p.totalHours, p.targetHours), p),
      flags: MessageFlags.Ephemeral,
    },
  }
}
