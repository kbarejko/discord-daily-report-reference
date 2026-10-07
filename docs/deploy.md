# Deploying to production

🇵🇱 [Wersja polska](pl/deploy.md)

Production is a Vercel project connected to this repository (D12): every push
to `main` deploys, every pull request gets a preview URL. The database is
Turso (D5). The mentor owns the production keys; an intern deploys by merging.

## Once: set up (mentor)

1. **Vercel project.** [vercel.com/new](https://vercel.com/new) → import
   `DigitalVantage/discord-daily-report` (public repository; the Hobby plan is
   enough). Framework: Next.js, no overrides.
2. **Turso database.**
   ```bash
   turso db create dv-daily-report --location fra
   turso db show dv-daily-report --url        # → DATABASE_URL (libsql://…)
   turso db tokens create dv-daily-report     # → DATABASE_AUTH_TOKEN
   ```
   Apply the migrations from your laptop, once, with those two values in a
   temporary `.env.production`:
   ```bash
   tsx --env-file=.env.production scripts/migrate.ts
   ```
3. **Production Discord application**: a separate application in the
   Developer Portal, the bot added to the team server with `bot` +
   `applications.commands` and _Send Messages_.
4. **Environment variables** in Vercel → Settings → Environment Variables,
   scope Production:

   | Variable                                                            | From                                                                                 |
   | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
   | `DISCORD_APPLICATION_ID`, `DISCORD_PUBLIC_KEY`, `DISCORD_BOT_TOKEN` | the production application                                                           |
   | `DISCORD_GUILD_ID`                                                  | the team server                                                                      |
   | `DATABASE_URL`, `DATABASE_AUTH_TOKEN`                               | Turso, step 2                                                                        |
   | `CRON_SECRET`                                                       | `openssl rand -hex 24`; Vercel sends it as `Authorization: Bearer` to the cron route |
   | `REMINDER_WEBHOOK_URL`                                              | the reports channel → Integrations → Webhooks (D13)                                  |
   | `REPORT_TEAM_USER_IDS`                                              | Discord ids of the interns, comma-separated                                          |

5. **Deploy**: push to `main`, or Deployments → Redeploy. Wait for
   `Ready`.
6. **Endpoint URL**: Developer Portal → production application → General
   Information → Interactions Endpoint URL =
   `https://<project>.vercel.app/api/interactions`. It saves only when the
   deployment answers PING and rejects bad signatures (#8).
7. **Commands** on the team server, from your laptop with the production
   values in `.env.production`:
   ```bash
   tsx --env-file=.env.production scripts/register-commands.ts
   ```
8. **Health**: open `https://<project>.vercel.app/api/health` → `{"ok":true}`.

## Every day

- A merge to `main` is a deployment. A pull request's preview URL is a
  deployment too, with the preview environment variables (none by default:
  previews answer PING and nothing else).
- The reminder runs from `vercel.json`: `0 13 * * 1-5` is 15:00 Warsaw time
  in summer. **After 25 October change it to `0 14 * * 1-5`** and merge; the
  Hobby plan runs it once a day within the hour.
- Logs: the Vercel dashboard → Deployments → Functions, or
  `vercel logs https://<project>.vercel.app` after `vercel login`.
- Something broken in production? Revert the merge on `main`; the previous
  deployment is also one click away under Deployments → Promote.

## Who does what 🇵🇱 Kto co robi

| Mentor                                                   | Intern                                                     |
| -------------------------------------------------------- | ---------------------------------------------------------- |
| Turso, Vercel, the production application, every secret  | code, tests, pull requests, merges to `main`               |
| the Endpoint URL and command registration for production | the same for their own test server (`docs/development.md`) |
