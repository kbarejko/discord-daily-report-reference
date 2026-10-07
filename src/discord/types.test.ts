import { describe, expect, it } from 'vitest'

import { type ApplicationCommandInteraction, InteractionType, userOf } from './types'

const base = {
  type: InteractionType.ApplicationCommand,
  id: '1',
  token: 't',
  data: { name: 'ping' },
}
const anna = { id: 'u1', username: 'anna' }

describe('userOf', () => {
  it('reads the member on a server', () => {
    const onServer: ApplicationCommandInteraction = { ...base, member: { user: anna } }
    expect(userOf(onServer)).toEqual(anna)
  })

  it('reads the user in a direct message', () => {
    const inDm: ApplicationCommandInteraction = { ...base, user: anna }
    expect(userOf(inDm)).toEqual(anna)
  })

  it('throws when neither is present', () => {
    const noUser: ApplicationCommandInteraction = { ...base }
    expect(() => userOf(noUser)).toThrow('without a user')
  })
})
