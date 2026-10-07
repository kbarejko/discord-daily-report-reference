import { describe, expect, it, vi } from 'vitest'

import { handleInteraction } from './handle'
import { command, testContext } from './test-helpers'
import type { MessageResponse } from './types'

describe('handleInteraction', () => {
  it('turns a throwing handler into a short ephemeral message and a log line', async () => {
    const ctx = testContext()
    ctx.reports.findByUserAndDay = async () => {
      throw new Error('SQLITE_BUSY: database is locked')
    }
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const response = (await handleInteraction(command('raport'), ctx)) as MessageResponse
    expect(response).toMatchObject({ type: 4, data: { flags: 64 } })
    expect(response.data?.content).toContain('Coś poszło nie tak')
    expect(JSON.stringify(response)).not.toMatch(/SQLITE|locked|at /)
    expect(error).toHaveBeenCalledWith('[interaction 1]', expect.any(Error))
    error.mockRestore()
  })

  it('still answers PING outside the error wrapper', async () => {
    expect(await handleInteraction({ type: 1 }, testContext())).toEqual({ type: 1 })
  })
})
