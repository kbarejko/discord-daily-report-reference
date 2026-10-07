/**
 * Sends the command list to your test server (D4).
 * Run: pnpm register-commands  (loads .env.local)
 */
import { commandDefinitions } from '../src/discord/commands/definitions'
import { getEnv } from '../src/env'

async function main(): Promise<void> {
  const env = getEnv()

  const url = `https://discord.com/api/v10/applications/${env.DISCORD_APPLICATION_ID}/guilds/${env.DISCORD_GUILD_ID}/commands`

  const response = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commandDefinitions),
  })

  if (!response.ok) {
    console.error(`Discord answered ${response.status} ${response.statusText}.`)
    if (response.status === 401)
      console.error('The bot token is wrong: check DISCORD_BOT_TOKEN in .env.local.')
    if (response.status === 403)
      console.error('The bot is not on this server, or DISCORD_GUILD_ID is another server.')
    console.error(await response.text())
    process.exit(1)
  }

  const registered = (await response.json()) as Array<{ name: string }>
  console.log(`Registered ${registered.length} command(s) on server ${env.DISCORD_GUILD_ID}:`)
  for (const command of registered) console.log(`  /${command.name}`)
}

main()
