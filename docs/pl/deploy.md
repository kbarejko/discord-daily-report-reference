# Wdrożenie na produkcję

🇬🇧 [English version](../deploy.md)

Produkcja to projekt Vercel podpięty do tego repozytorium (D12): każdy push
na `main` to deploy, każdy pull request dostaje adres podglądowy. Baza to
Turso (D5). Klucze produkcyjne należą do opiekuna; praktykant wdraża przez
merge.

## Raz: przygotowanie (opiekun)

1. **Projekt Vercel.** [vercel.com/new](https://vercel.com/new) → import
   `DigitalVantage/discord-daily-report` (repozytorium publiczne; plan Hobby
   wystarczy). Framework: Next.js, bez zmian.
2. **Baza Turso.**
   ```bash
   turso db create dv-daily-report --location fra
   turso db show dv-daily-report --url        # → DATABASE_URL (libsql://…)
   turso db tokens create dv-daily-report     # → DATABASE_AUTH_TOKEN
   ```
   Migracje z laptopa, raz, z tymi dwiema wartościami w tymczasowym
   `.env.production`:
   ```bash
   tsx --env-file=.env.production scripts/migrate.ts
   ```
3. **Produkcyjna aplikacja Discord**: osobna aplikacja w Developer Portal, bot
   dodany na serwer zespołu z `bot` + `applications.commands` i _Send
   Messages_.
4. **Zmienne środowiskowe** w Vercel → Settings → Environment Variables,
   zakres Production:

   | Zmienna                                                             | Skąd                                                                                   |
   | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
   | `DISCORD_APPLICATION_ID`, `DISCORD_PUBLIC_KEY`, `DISCORD_BOT_TOKEN` | aplikacja produkcyjna                                                                  |
   | `DISCORD_GUILD_ID`                                                  | serwer zespołu                                                                         |
   | `DATABASE_URL`, `DATABASE_AUTH_TOKEN`                               | Turso, krok 2                                                                          |
   | `CRON_SECRET`                                                       | `openssl rand -hex 24`; Vercel wysyła go jako `Authorization: Bearer` do route'a crona |
   | `REMINDER_WEBHOOK_URL`                                              | kanał raportów → Integracje → Webhooki (D13)                                           |
   | `REPORT_TEAM_USER_IDS`                                              | id Discorda praktykantów, po przecinku                                                 |

5. **Deploy**: push na `main` albo Deployments → Redeploy. Poczekaj na
   `Ready`.
6. **Endpoint URL**: Developer Portal → aplikacja produkcyjna → General
   Information → Interactions Endpoint URL =
   `https://<projekt>.vercel.app/api/interactions`. Zapisze się tylko, gdy
   deploy odpowiada na PING i odrzuca złe podpisy (#8).
7. **Komendy** na serwerze zespołu, z laptopa z wartościami produkcyjnymi w
   `.env.production`:
   ```bash
   tsx --env-file=.env.production scripts/register-commands.ts
   ```
8. **Health**: otwórz `https://<projekt>.vercel.app/api/health` →
   `{"ok":true}`.

## Codziennie

- Merge na `main` to deploy. Adres podglądowy pull requesta to też deploy, ze
  zmiennymi środowiska Preview (domyślnie brak: podgląd odpowiada na PING i
  nic więcej).
- Przypomnienie działa z `vercel.json`: `0 13 * * 1-5` to 15:00 w Warszawie
  latem. **Po 25 października zmień na `0 14 * * 1-5`** i zmerguj; plan Hobby
  uruchamia je raz dziennie w ciągu godziny.
- Logi: panel Vercel → Deployments → Functions, albo
  `vercel logs https://<projekt>.vercel.app` po `vercel login`.
- Coś zepsute na produkcji? Cofnij merge na `main`; poprzedni deploy jest też
  jedno kliknięcie dalej w Deployments → Promote.

## Kto co robi

| Opiekun                                            | Praktykant                                                        |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| Turso, Vercel, aplikacja produkcyjna, każdy sekret | kod, testy, pull requesty, merge na `main`                        |
| Endpoint URL i rejestracja komend dla produkcji    | to samo dla własnego serwera testowego (`docs/pl/development.md`) |
