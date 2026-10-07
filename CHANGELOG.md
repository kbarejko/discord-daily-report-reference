# Changelog

Every `feat` and `fix` pull request adds a line under `[Unreleased]`, in the
same pull request as the code.

## [Unreleased]

### Added

- /moje-raporty shows your last 7 reports, only to you.
- /raport: a short form (what I did, hours, problems, plan) saves today's report; a second one the same day replaces the first.
- Reports are stored in the database through the same contract the tests use.
- The database layer: Drizzle with libSQL, `pnpm db:generate` and `pnpm db:migrate`.
- /ping answers "pong" with the response time, visible only to you.
- The bot answers Discord's PING at /api/interactions and rejects unsigned requests.
- pnpm register-commands puts the bot's commands on your test server.
- One tested rule for "today" in Europe/Warsaw.
- Settings are checked at startup; a missing one is named in the error.
- Requests that are not signed by Discord are recognised.
- The report contract and an in-memory repository for tests.

### Docs

- The README, the architecture and the development guide exist in English and
  in simple Polish (`README.pl.md`, `docs/pl/`), with a language switch at the
  top of each; the issue and pull request templates carry Polish after every
  line.
- The bot runs on Vercel with the database in Turso: decisions D5, D9 and the
  new D12, and each developer's own Vercel deployment instead of a tunnel.
- Working hours and the daily log issues in the README.
- Architecture (HLD), local development guide and the team-of-two workflow.
