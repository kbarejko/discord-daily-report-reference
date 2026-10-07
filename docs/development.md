# Local development

🇵🇱 [Wersja polska](pl/development.md)

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
4. Add the bot to your test server. Either _OAuth2 → URL Generator_ (scopes
   `bot` + `applications.commands`, bot permission _Send Messages_), or type
   the same link yourself, with your Application ID:
   `https://discord.com/oauth2/authorize?client_id=<APPLICATION_ID>&scope=bot%20applications.commands&permissions=2048`.
   Open it, pick the server, _Authorize_. The bot appears on the member list
   as offline; that is right, it never connects to the gateway (D1).

Check the three values without deploying anything. With the token from
`.env.local`, Discord answers who the bot is and whether it is on your server:

```bash
T=$(grep '^DISCORD_BOT_TOKEN=' .env.local | cut -d= -f2)
curl -s -H "Authorization: Bot $T" https://discord.com/api/v10/users/@me          # {"username":"…","bot":true}
curl -s -H "Authorization: Bot $T" https://discord.com/api/v10/guilds/$(grep '^DISCORD_GUILD_ID=' .env.local | cut -d= -f2)
```

The second call answers `{"message":"Unknown Guild","code":10004}` until the
bot is on the server. Then it answers with the server's name.

## 3. A public URL for your bot: your own Vercel deployment

Discord cannot call `localhost:3000`, so your bot needs a public address. Each
of you deploys **your own copy** of the app to a free Vercel account (D12).
The address stays the same, so you enter it in the Developer Portal once.

Once:

1. Create a free account at [vercel.com/signup](https://vercel.com/signup)
   with **Continue with GitHub**. The free (Hobby) plan is enough.
2. Install the command-line tool inside Ubuntu and log in:
   ```bash
   npm install -g vercel
   vercel --version
   vercel login
   vercel whoami
   ```
   - `npm install -g`, not `pnpm add -g`: `pnpm`'s global folder needs a one-time
     `pnpm setup` first, and the "never `npm i -g pnpm`" rule from the machine
     setup is about pnpm itself, not about other tools. With Node from nvm the
     global install lands in your home folder, no `sudo`.
   - ✅ `vercel --version` prints `Vercel CLI 62.x` (or newer). `command not
found`? Close the terminal and open it again.
   - `vercel login` asks how to log in: choose **Continue with GitHub**, the
     browser opens, confirm. No Vercel account yet? It is created right there,
     on the free Hobby plan.
   - ✅ `vercel whoami` prints your username. If it says you are not logged in,
     the browser step did not finish: run `vercel login` again.
3. In the project folder, create your Vercel project and give it your five
   settings from `.env.local` (one command per variable; paste the value when
   asked, nothing is shown while pasting):
   ```bash
   cd ~/projects/discord-daily-report
   vercel link            # Set up? Y → your account → Link to existing project? N → name: dv-bot-dev-<your-name>
   vercel env add DISCORD_APPLICATION_ID production
   vercel env add DISCORD_PUBLIC_KEY production
   vercel env add DISCORD_BOT_TOKEN production
   vercel env add DISCORD_GUILD_ID production
   vercel env add CRON_SECRET production
   ```
   `vercel link` creates a `.vercel/` folder and adds it to `.gitignore`. It
   holds only project ids, but keep it out of commits anyway.

Every time you want Discord to see your current code:

```bash
pnpm test --run && pnpm build    # catch errors here, not after the deploy
vercel --prod
```

✅ The last line is `Production: https://dv-bot-dev-<your-name>.vercel.app`.
That is your bot's address. The deploy takes about a minute.

In the Developer Portal → _General Information_ → **Interactions Endpoint
URL** enter `https://dv-bot-dev-<your-name>.vercel.app/api/interactions` and
save. Discord sends a test request with a bad signature first. The save only
succeeds once your endpoint answers PING and rejects bad signatures (milestone
1). Until then the field will not save, and that is expected.

Logs of the deployed bot: `vercel logs https://dv-bot-dev-<your-name>.vercel.app`
or the **Logs** tab on vercel.com. A handler that throws shows up there.

> **Why not a tunnel to the laptop?** It works too
> (`cloudflared tunnel --url http://localhost:3000`), but the address changes
> on every restart and it is one more tool to run. A deploy costs a minute;
> the logic is tested locally with vitest, so you go to Discord only when the
> logic already works.

## 4. Commands

After a command's definition changes:

```bash
pnpm register-commands   # added in milestone 1
```

Commands registered on a test server show up immediately. If one is missing,
press `Ctrl+R` in Discord.

## 5. When something does not work

| Symptom                              | Usually                                                                                                     |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| "The application did not respond"    | Your handler threw or took more than 3 s. Look at `vercel logs` (or the `pnpm dev` terminal with a tunnel). |
| The Endpoint URL will not save       | You changed code but did not run `vercel --prod`, the path is wrong, or the signature check fails.          |
| Discord still sees the old behaviour | Run `vercel --prod` again and wait for `Production:` before trying.                                         |
| `vercel --prod` fails in the build   | Run `pnpm build` locally and read the first error. The deployed build has the same code.                    |
| `401` on every request               | `DISCORD_PUBLIC_KEY` is from a different application.                                                       |
| `Unknown Guild` from the API         | The bot is not on that server: open the authorise link from section 2 again. The id is probably right.      |
| The command is not in the list       | Not registered on this server (`pnpm register-commands`), or Discord needs `Ctrl+R`.                        |
| Changes in `.env.local` are ignored  | Restart `pnpm dev`.                                                                                         |
