# Local development

Each of you runs your **own** Discord application against your **own** test
server (decision D11). Discord sends interactions to the URL set in your app,
so with one shared app the two of you would steal each other's requests.

## 1. Your test server

In Discord: **+** (Add a Server) → _Create My Own_ → _For me and my friends_.
Name it something like `dv-bot-dev-anna`. Then turn on _User Settings →
Advanced → Developer Mode_, right-click the server → _Copy Server ID_, and put
it in `.env.local` as `DISCORD_GUILD_ID`.

## 2. Your development application

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
   → _New Application_, for example `DV Daily Report (dev, Anna)`.
2. _General Information_: copy **Application ID** → `DISCORD_APPLICATION_ID`
   and **Public Key** → `DISCORD_PUBLIC_KEY`.
3. _Bot_ → _Reset Token_, copy it once → `DISCORD_BOT_TOKEN`. It is a password:
   it goes only in `.env.local`, never in a commit, an issue or a Discord
   message.
4. _OAuth2 → URL Generator_: scopes `bot` + `applications.commands`, bot
   permission _Send Messages_. Open the generated URL and add the bot to your
   test server.

## 3. A public URL for your laptop

Discord has to reach `localhost:3000`, so you need a tunnel:

```bash
# once: install cloudflared (no account needed for quick tunnels)
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o /tmp/cloudflared.deb
sudo apt install /tmp/cloudflared.deb

# every session, in a second terminal next to `pnpm dev`
cloudflared tunnel --url http://localhost:3000
```

It prints a URL like `https://random-words.trycloudflare.com`. In the Developer
Portal → _General Information_ → **Interactions Endpoint URL** enter
`<that URL>/api/interactions` and save. Discord sends a test request with a bad
signature first. The save only succeeds once your endpoint answers PING and
rejects bad signatures (milestone 1). Until then the field will not save, and
that is expected.

The quick-tunnel URL changes on every restart, so update the field each time.

## 4. Commands

After a command's definition changes:

```bash
pnpm register-commands   # added in milestone 1
```

Commands registered on a test server show up immediately. If one is missing,
press `Ctrl+R` in Discord.

## 5. When something does not work

| Symptom                             | Usually                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------ |
| "The application did not respond"   | Your handler threw or took more than 3 s. Look at the `pnpm dev` terminal.           |
| The Endpoint URL will not save      | The tunnel is down, the path is wrong, or the signature check fails.                 |
| `401` on every request              | `DISCORD_PUBLIC_KEY` is from a different application.                                |
| The command is not in the list      | Not registered on this server (`pnpm register-commands`), or Discord needs `Ctrl+R`. |
| Changes in `.env.local` are ignored | Restart `pnpm dev`.                                                                  |
