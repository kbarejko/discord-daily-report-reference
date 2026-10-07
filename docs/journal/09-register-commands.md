# #9 Script that registers the slash commands

## Top-level await is not allowed here

The first version had `await fetch(...)` at the top of the file. `tsx`:

```text
Error: Transform failed with 3 errors:
scripts/register-commands.ts:12:17: ERROR: Top-level await is currently not supported with the "cjs" output format
```

`package.json` has no `"type": "module"`, so `tsx` compiles the script as
CommonJS, where top-level `await` does not exist. Wrapping the body in
`async function main()` and calling `main()` at the end is the fix, and it
is how every script in this repository will be written.

## The real run, against the test server

```bash
pnpm register-commands
```

```text
$ tsx --env-file=.env.local scripts/register-commands.ts
Registered 1 command(s) on server 1557306726477201439:
  /ping
```

In Discord, on **DV Interns' server**, typing `/` now shows `ping` with the
description from `definitions.ts`. Sending it answers "The application did
not respond", because nothing is deployed yet: that is #8 and #11.

## The two error paths, on purpose

With one character of the token changed:

```text
Discord answered 401 Unauthorized.
The bot token is wrong: check DISCORD_BOT_TOKEN in .env.local.
{"message": "401: Unauthorized", "code": 0}
```

With the id of a server the bot is not on:

```text
Discord answered 403 Forbidden.
The bot is not on this server, or DISCORD_GUILD_ID is another server.
{"message": "Missing Access", "code": 50001}
```

`401` is "who are you?" (the token), `403` is "you may not do that here"
(the server). The script says which setting to look at, so the reader does
not have to know Discord's error codes.

## What I learned 🇵🇱 Czego się nauczyłem

- `PUT …/guilds/{guild}/commands` replaces the **whole** list. Remove a
  command from `definitions.ts`, run the script, and it is gone from Discord.
  One source of truth.
  🇵🇱 _`PUT …/guilds/{guild}/commands` zastępuje **całą** listę. Usuń komendę z `definitions.ts`, uruchom skrypt i znika z Discorda. Jedno źródło prawdy._
- A script outside the app still goes through `getEnv()`, so a missing
  variable fails with its name before any request is sent.
  🇵🇱 _Skrypt poza aplikacją też idzie przez `getEnv()`, więc brak zmiennej pada z jej nazwą, zanim poleci jakiekolwiek żądanie._
- Never print the token, not even while debugging. The script prints the
  server id instead.
  🇵🇱 _Nigdy nie wypisuj tokenu, nawet przy debugowaniu. Skrypt wypisuje zamiast tego id serwera._
