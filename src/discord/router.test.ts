import { describe, expect, it } from 'vitest'

import { routeCommand } from './router'
import { command, testContext } from './test-helpers'

describe('routeCommand', () => {
  it('answers /ping with pong, only for the caller', async () => {
    const response = await routeCommand(command('ping'), testContext())
    expect(response.type).toBe(4)
    expect(response).toMatchObject({ data: { flags: 64 } })
    expect((response as { data: { content: string } }).data.content).toMatch(/^pong/)
  })

  it('answers an unknown command politely instead of crashing', async () => {
    const response = await routeCommand(command('nope'), testContext())
    expect(response).toMatchObject({ type: 4, data: { flags: 64 } })
    expect((response as { data: { content: string } }).data.content).toContain('/nope')
  })
})
