# #16 SQLite implementation of ReportRepository

## The same suite twice

```text
 Test Files  3 passed (3)
      Tests  12 passed (12)
```

## How `upsert` uses the index from #15

```ts
.insert(reports).values({ id: crypto.randomUUID(), ...input, createdAt: now, updatedAt: now })
.onConflictDoUpdate({ target: [reports.discordUserId, reports.day], set: { done, hours, problems, plan, updatedAt: now } })
```

Insert; if the unique index `(discord_user_id, day)` fires, update that row
instead. The `id` and `created_at` of the first report survive, which is what
the suite's second test checks for both implementations.

## What I learned 🇵🇱 Czego się nauczyłem

- A contract is worth little until the same tests run against every
  implementation. The suite is a function; each implementation is one line.
  🇵🇱 _Kontrakt jest niewiele wart, dopóki te same testy nie biegną na każdej implementacji. Zestaw to funkcja; każda implementacja to jedna linia._
- `:memory:` plus the real migrations is faster than a file and closer to
  production than a mock.
  🇵🇱 _`:memory:` plus prawdziwe migracje jest szybsze niż plik i bliższe produkcji niż atrapa._
