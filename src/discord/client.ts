/** The few calls the bot makes to Discord's REST API (architecture §5). */
export type FollowUp = {
  content: string
  /** Ephemeral by default: only the caller sees the follow-up. */
  flags?: number
  file?: { filename: string; content: string }
}

export type DiscordClient = {
  /** Edits the deferred reply of an interaction, optionally with a file attached. */
  followUp(applicationId: string, token: string, message: FollowUp): Promise<void>
}

const API = 'https://discord.com/api/v10'

export function createDiscordClient(fetchFn: typeof fetch = fetch): DiscordClient {
  return {
    async followUp(applicationId, token, message) {
      // A file needs multipart/form-data: the JSON part is called payload_json, the file files[0].
      const form = new FormData()
      form.set(
        'payload_json',
        JSON.stringify({ content: message.content, flags: message.flags ?? 64 }),
      )
      if (message.file)
        form.set(
          'files[0]',
          new Blob([message.file.content], { type: 'text/markdown' }),
          message.file.filename,
        )
      const response = await fetchFn(
        `${API}/webhooks/${applicationId}/${token}/messages/@original`,
        { method: 'PATCH', body: form },
      )
      if (!response.ok)
        throw new Error(`Discord follow-up failed: ${response.status} ${await response.text()}`)
    },
  }
}
