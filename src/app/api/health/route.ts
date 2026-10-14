import { getDb } from '@/db/client'
import { checkDatabase } from '@/db/health'

/** For the hosting platform and a human in a browser: is the app up and can it read the reports table? */
export async function GET(): Promise<Response> {
  try {
    await checkDatabase(getDb())
    return Response.json({ ok: true })
  } catch (error) {
    console.error('[health]', error)
    // No message, no version: nothing an outsider could use.
    return Response.json({ ok: false }, { status: 503 })
  }
}
