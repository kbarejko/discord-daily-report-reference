import { describe, expect, it } from 'vitest'

import { checkAccess } from './basic-auth'

const basic = (credentials: string) => `Basic ${Buffer.from(credentials).toString('base64')}`

describe('checkAccess', () => {
  it('hides the page when no password is configured', () => {
    expect(checkAccess(basic('a:b'), undefined)).toBe('hidden')
    expect(checkAccess(null, '')).toBe('hidden')
  })

  it('asks for the password when there is no header or it is not Basic', () => {
    expect(checkAccess(null, 'secret')).toBe('ask')
    expect(checkAccess('Bearer secret', 'secret')).toBe('ask')
    expect(checkAccess(`Basic ${Buffer.from('no-colon').toString('base64')}`, 'secret')).toBe('ask')
  })

  it('asks again for a wrong password', () => {
    expect(checkAccess(basic('mentor:wrong'), 'secret')).toBe('ask')
  })

  it('lets the right password in, whatever the user name', () => {
    expect(checkAccess(basic('mentor:secret'), 'secret')).toBe('allow')
    expect(checkAccess(basic(':secret'), 'secret')).toBe('allow')
  })

  it('keeps a colon inside the password', () => {
    expect(checkAccess(basic('mentor:a:b'), 'a:b')).toBe('allow')
  })
})
