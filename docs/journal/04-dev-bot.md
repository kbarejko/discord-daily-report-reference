# #4 Set up your own development bot and test server

Console transcript of the reference run, 7 October 2026. Commands as typed in
the Ubuntu terminal, output as printed. Secrets are replaced with `…`.

## 1. The test server and the application

Done in the browser: a server **DV Interns' server** with a channel
`#raporty`, and an application **DV Daily Report (reference)** in the
Developer Portal. The ids went into `.env.local`.

## 2. Does the token work? Who is the bot?

A read-only call to Discord with the bot token. `users/@me` answers with the
bot's own account:

```bash
T=$(grep '^DISCORD_BOT_TOKEN=' .env.local | cut -d= -f2)
curl -s -H "Authorization: Bot $T" https://discord.com/api/v10/users/@me
```

```json
{ "username": "DV Daily Report (reference)", "id": "1557308716913528842", "bot": true }
```

## 3. Is the bot on the server? First try: no

```bash
curl -s -H "Authorization: Bot $T" https://discord.com/api/v10/guilds/1557306726477201439
```

```json
{ "message": "Unknown Guild", "code": 10004 }
```

"Unknown Guild" does not mean the server does not exist. It means **this bot
is not a member of it**, so Discord pretends it is not there. The fix was the
OAuth2 authorise link from `docs/development.md` §2 step 4, opened in the
browser, server chosen, _Authorize_.

## 4. Second try: yes

```bash
curl -s -H "Authorization: Bot $T" https://discord.com/api/v10/guilds/1557306726477201439
curl -s -H "Authorization: Bot $T" https://discord.com/api/v10/guilds/1557306726477201439/channels
curl -s -H "Authorization: Bot $T" https://discord.com/api/v10/applications/1557308716913528842/guilds/1557306726477201439/commands
```

```json
{ "name": "DV Interns' server", "id": "1557306726477201439" }
[["Text Channels", "1557306727043702924", 4], ["Voice Channels", "1557306727043702925", 4], ["raporty", "1557306727043702926", 0], ["General", "1557306727043702927", 2]]
[]
```

The bot sees the channels, and the command list is empty: `/ping` arrives
with #9.

## 5. The settings file

`.env.local` was checked with the parser from #6 (branch `feat/6-env`), which
names what is missing. First run, before the token was pasted in:

```bash
node --env-file=.env.local --no-warnings -e "import('./src/env.ts').then(m => { m.getEnv(); console.log('env ok') })"
```

```text
Error: Missing or empty environment variables: DISCORD_BOT_TOKEN, DATABASE_AUTH_TOKEN
```

Two things are wrong here, and only one of them is the missing token.
`DATABASE_AUTH_TOKEN` is **optional** (empty until Turso in M4), but
`.env.example` ships it as an empty line `DATABASE_AUTH_TOKEN=`, which is an
empty string, not an absent variable. The first version of the schema,
`z.string().min(1).optional()`, rejected that. Fixed on `feat/6-env`: an empty
optional variable is turned into `undefined`, with a test for it. Second run,
after the token:

```text
env ok
```

## What I learned 🇵🇱 Czego się nauczyłem

- A Discord **token is a password**. It belongs in `.env.local` and in Vercel's
  settings, never in a chat message, an issue or a screenshot. When one is
  pasted anywhere else, reset it in the Developer Portal.
  🇵🇱 _Token Discorda to hasło. Jego miejsce to `.env.local` i ustawienia Vercela, nigdy czat, issue ani zrzut ekranu. Gdy trafi gdzie indziej, zresetuj go w Developer Portal._
- `Unknown Guild` from the API means "the bot is not on that server", not
  "wrong id".
  🇵🇱 _`Unknown Guild` z API znaczy „bota nie ma na tym serwerze”, a nie „zły identyfikator”._
- A read-only `curl` with the bot token is the fastest way to check the three
  Discord values without deploying anything.
  🇵🇱 _`curl` tylko do odczytu z tokenem bota to najszybszy sposób sprawdzenia trzech wartości z Discorda bez żadnego deployu._
- An **optional** setting must accept an empty value, because the template
  ships empty values.
  🇵🇱 _Ustawienie **opcjonalne** musi przyjmować pustą wartość, bo szablon ma puste wartości._

## Still open

The Vercel part (own account, `vercel link`, `vercel --prod`) waits for a
`vercel login` in this environment. The Interactions Endpoint URL cannot be
saved before #8 anyway.

## Later the same day: the Vercel half

```bash
pnpm setup && pnpm add -g vercel && vercel login && vercel whoami
vercel link --yes --project dv-bot-dev-reference
vercel env add DISCORD_APPLICATION_ID production   # … and the other seven, value from .env.local
vercel env ls production
pnpm build && vercel --prod --yes
```

```text
✓ Added  DISCORD_APPLICATION_ID DISCORD_PUBLIC_KEY DISCORD_BOT_TOKEN DISCORD_GUILD_ID CRON_SECRET REMINDER_WEBHOOK_URL REPORT_TEAM_USER_IDS DATABASE_URL
● Ready  Production  https://dv-bot-dev-reference.vercel.app
```

```bash
curl -s https://dv-bot-dev-reference.vercel.app/api/health
curl -s -o /dev/null -w '%{http_code}' -X POST -d '{"type":1}' https://dv-bot-dev-reference.vercel.app/api/interactions
```

```text
{"ok":true}
401
```

Two things to know about `vercel link`: it writes `.vercel/` (git-ignored
already) and it **appends `VERCEL_OIDC_TOKEN` to `.env.local`**. Harmless,
but do not be surprised by the extra line.

`DATABASE_URL` on this deployment is `file:/tmp/reports.db`: a scratch file
with no tables, enough for PING, `/ping` and the health check. Anything that
touches reports needs Turso (`docs/deploy.md`), which is the next step.
