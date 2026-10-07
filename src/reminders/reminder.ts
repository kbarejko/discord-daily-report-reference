import { messages } from '@/messages'

/** Pure: who is missing today → the message to post, or null when nobody is. */
export function reminderFor(team: string[], reported: string[], today: string): string | null {
  const missing = team.filter((id) => !reported.includes(id))
  if (missing.length === 0) return null
  return messages.reminder(
    today,
    missing.map((id) => `<@${id}>`),
  )
}

/** Posts through the channel webhook (D13). `fetchFn` is replaceable for tests. */
export async function postReminder(
  webhookUrl: string,
  content: string,
  fetchFn: typeof fetch = fetch,
): Promise<void> {
  const response = await fetchFn(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // allowed_mentions: only the users named, never @everyone or roles.
    body: JSON.stringify({ content, allowed_mentions: { parse: ['users'] } }),
  })
  if (!response.ok)
    throw new Error(`Reminder webhook failed: ${response.status} ${await response.text()}`)
}
