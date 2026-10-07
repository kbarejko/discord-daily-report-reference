import type { FollowUp } from '@/discord/client'
import type { Context } from '@/discord/context'
import {
  type ApplicationCommandInteraction,
  InteractionType,
  type ModalSubmitInteraction,
} from '@/discord/types'
import { MemoryReportRepository } from '@/reports/memory-repository'

export const anna = { id: 'u1', username: 'anna' }

export function command(name: string): ApplicationCommandInteraction {
  return {
    type: InteractionType.ApplicationCommand,
    id: '1',
    token: 't',
    data: { name },
    member: { user: anna },
  }
}

export function modal(customId: string, fields: Record<string, string>): ModalSubmitInteraction {
  return {
    type: InteractionType.ModalSubmit,
    id: '2',
    token: 't',
    data: {
      custom_id: customId,
      components: Object.entries(fields).map(([custom_id, value]) => ({
        components: [{ custom_id, value }],
      })),
    },
    member: { user: anna },
  }
}

export type TestContext = Context & {
  /** Every follow-up the fake Discord client received. */
  sent: Array<{ applicationId: string; token: string; message: FollowUp }>
  /** Runs the work handlers deferred with `ctx.defer`, in order. */
  flushDeferred: () => Promise<void>
}

/** A context on an in-memory repository, a fake Discord, and time pinned to 2026-10-07 14:00 in Warsaw. */
export function testContext(): TestContext {
  const sent: TestContext['sent'] = []
  const deferred: Array<() => Promise<void>> = []
  return {
    reports: new MemoryReportRepository(),
    applicationId: 'app',
    now: () => new Date('2026-10-07T12:00:00Z'),
    discord: {
      followUp: async (applicationId, token, message) =>
        void sent.push({ applicationId, token, message }),
    },
    defer: (work) => void deferred.push(work),
    sent,
    flushDeferred: async () => {
      while (deferred.length) await deferred.shift()!()
    },
  }
}
