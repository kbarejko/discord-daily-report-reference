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

/** A context on an in-memory repository, with time pinned to 2026-10-07 14:00 in Warsaw. */
export function testContext(): Context {
  return { reports: new MemoryReportRepository(), now: () => new Date('2026-10-07T12:00:00Z') }
}
