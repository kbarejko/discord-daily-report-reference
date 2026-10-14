import { type NextRequest, NextResponse } from 'next/server'

import { getEnv } from '@/env'
import { messages } from '@/messages'
import { checkAccess } from '@/web/basic-auth'

/** Runs before /raporty (Next 16's name for middleware): the password check of D14. */
export function proxy(request: NextRequest): NextResponse {
  const access = checkAccess(request.headers.get('authorization'), getEnv().DASHBOARD_PASSWORD)
  if (access === 'allow') return NextResponse.next()
  if (access === 'hidden') return new NextResponse(null, { status: 404 })
  return new NextResponse(messages.teamPage.passwordNeeded, {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="raporty", charset="UTF-8"' },
  })
}

export const config = { matcher: '/raporty' }
