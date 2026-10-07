import { describe, expect, it } from 'vitest'

import { routeCommand } from './router'
import { type ApplicationCommandInteraction, InteractionType } from './types'

function command(name: string): ApplicationCommandInteraction {
  return { type: InteractionType.ApplicationCommand, id: '1', token: 't', data: { name } }
}

describe('routeCommand', () => {
  it('answers /ping with pong, only for the caller', async () => {
    const response = await routeCommand(command('ping'))
    expect(response.type).toBe(4)
    expect(response).toMatchObject({ data: { flags: 64 } })
    expect((response as { data: { content: string } }).data.content).toMatch(/^pong/)
  })

  it('answers an unknown command politely instead of crashing', async () => {
    const response = await routeCommand(command('nope'))
    expect(response).toMatchObject({ type: 4, data: { flags: 64 } })
    expect((response as { data: { content: string } }).data.content).toContain('/nope')
  })
})
