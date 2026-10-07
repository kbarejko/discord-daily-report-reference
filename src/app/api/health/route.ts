import { sql } from 'drizzle-orm'

import { getDb } from '@/db/client'

/** For the hosting platform and a human in a browser: is the app up and can it reach the database? */
export async function GET(): Promise<Response> {
  try {
    await getDb().run(sql`select 1`)
    return Response.json({ ok: true })
  } catch (error) {
    console.error('[health]', error)
    // No message, no version: nothing an outsider could use.
    return Response.json({ ok: false }, { status: 503 })
  }
}
