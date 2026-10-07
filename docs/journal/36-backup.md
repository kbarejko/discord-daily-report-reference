# #36 Back up the database

```text
2 report(s) written to backups/reports-2026-10-07T09-52-37-151Z.json
Migrations applied to file:./data/reports.db
2 report(s) restored from backups/reports-2026-10-07T09-52-37-151Z.json
after restore: 2026-10-06 7h Wtorek | 2026-10-07 7.5h Środa
```

## Three layers 🇵🇱 Trzy warstwy

1. Turso's point-in-time restore (one day on the free plan): a mistake noticed
   today is undone in the dashboard.
   🇵🇱 _Przywracanie w czasie Turso (jeden dzień na darmowym planie): błąd zauważony dziś cofa się w panelu._
2. `pnpm db:backup` from a laptop with the production `DATABASE_URL`, kept
   wherever the mentor keeps backups; `pnpm db:restore` puts it back into any
   database, live or fresh.
   🇵🇱 _`pnpm db:backup` z laptopa z produkcyjnym `DATABASE_URL`, trzymane tam, gdzie opiekun trzyma kopie; `pnpm db:restore` wkłada to z powrotem do dowolnej bazy._
3. `/eksport`: every intern can pull their own diary at any time.
   🇵🇱 _`/eksport`: każdy praktykant może w każdej chwili pobrać swój dziennik._

## What I learned 🇵🇱 Czego się nauczyłem

- Restore with the same upsert rule as the app, and a restore onto a live
  database cannot create duplicates.
  🇵🇱 _Odtwarzaj tą samą regułą upsert co aplikacja, a odtworzenie na żywą bazę nie zrobi duplikatów._
