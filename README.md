# Daily report bot

🇵🇱 [Wersja polska](README.pl.md)

A Discord bot for the Digital Vantage team. Once a day everyone types
`/raport`, fills in a short form (what I did, hours, problems, plan) and the bot
keeps it. At the end of the internship one command exports everything for the
internship diary.

Built by two interns, in four weeks, as a real project: it is going to be used
by the team after you leave.

- **How it works and what is already decided:** [docs/architecture.md](docs/architecture.md). Read it first.
- **Running it on your machine:** [docs/development.md](docs/development.md).
- **The team process** (branches, commits, CHANGELOG, review) is the same as in
  [intern-playground](https://github.com/DigitalVantage/intern-playground#how-we-work).

## Getting started

```bash
git clone git@github.com:DigitalVantage/discord-daily-report.git
cd discord-daily-report
nvm use && corepack enable
pnpm install
cp .env.example .env.local   # then fill it in: docs/development.md
pnpm dev
```

| Command                  | What it does                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `pnpm dev`               | dev server on http://localhost:3000                                                  |
| `pnpm lint`              | ESLint                                                                               |
| `pnpm typecheck`         | TypeScript                                                                           |
| `pnpm test`              | Vitest, watch mode (`pnpm test --run` for once)                                      |
| `pnpm build`             | production build                                                                     |
| `pnpm format`            | Prettier                                                                             |
| `pnpm register-commands` | sends the command list to your test server (run after a command changes)             |
| `pnpm db:generate`       | writes a migration from `src/db/schema.ts` into `drizzle/` (after a schema change)   |
| `pnpm db:migrate`        | applies the migrations to `DATABASE_URL` (once after clone, and after `db:generate`) |

More commands come with the issues that add them (`register-commands`,
`db:migrate`, …). Each of those issues adds its line to this table.

## Working as a team of two

The work is split into **two tracks**, so neither of you waits for the other:

| Track                  | Label            | Covers                                                 |
| ---------------------- | ---------------- | ------------------------------------------------------ |
| **A: Discord**         | `track: discord` | the endpoint, signatures, commands, forms, replies     |
| **B: data and export** | `track: data`    | database, validation, the repository, export, progress |
| shared                 | `track: shared`  | the contract, reminders, deployment, docs              |

Pick a track each for the first milestone, then **swap for milestone 3**, so
both of you see both halves. The tracks meet in one interface,
`ReportRepository` ([architecture §3](docs/architecture.md#3-modules-and-the-line-between-the-two-tracks)).
Agree on it **together** in the first days, in one pull request.

### Taking an issue

1. Pick an issue from the **current milestone** whose blockers are closed
   (the `Blocked by #…` line in the issue).
2. **Assign it to yourself** and comment "Taking this". Assignment means "I am
   working on it now".
3. Have **at most two** issues assigned at a time. Stuck for more than a day?
   Unassign yourself, comment where you stopped, and pick something else.
4. Start with `good first issue` if you are new to an area. `decision` issues
   end in a short written choice in the pull request, not only in code.

### Pull requests and review

- Every pull request is **reviewed by the other intern first**, then by the
  code owner. Reviewing is part of the work, not a favour: aim to review within
  half a day.
- Link the issue (`Closes #12`). One issue, one pull request.
- Changes to the contract (`ReportRepository`, the `Report` type) need a
  comment from both of you before merge, because they touch both tracks.

### Every day

- **Daily meeting at 12:00** on Google Meet (sometimes a little later).
- **Work during the day**, somewhere between 9:00 and 19:00 on working days,
  **never at night**: the reviews you wait for happen in the day.
- **A daily log entry** at the end of your work, as a comment in your pinned
  issue: [#40 Artem](https://github.com/DigitalVantage/discord-daily-report/issues/40),
  [#41 Mykyta](https://github.com/DigitalVantage/discord-daily-report/issues/41)
  (the format is inside). Once milestone 2 is merged, use the bot itself:
  `/raport`.
- Blocked on something only the mentor can do (keys, the server, access)?
  Say so on Discord the same day.

## Milestones

| Milestone                   | Due        | Done when                                                 |
| --------------------------- | ---------- | --------------------------------------------------------- |
| **M1: The bot answers**     | 9 October  | `/ping` works end to end on both of your test servers     |
| **M2: Reports are saved**   | 16 October | `/raport` saves to SQLite, `/moje-raporty` lists them     |
| **M3: Export and progress** | 23 October | `/eksport` produces the diary file, `/postep` shows hours |
| **M4: In production**       | 30 October | deployed on Vercel, reminders on, the team uses it        |
