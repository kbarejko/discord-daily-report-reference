# #5 Agree on the ReportRepository contract

## The decision

The contract from architecture §3 was taken as is. One addition: `NewReport`
is its own exported type instead of an inline `Omit<…>`, because every caller
of `upsert` needs to name it.

## Green

```bash
pnpm test --run src/reports/memory-repository.test.ts
```

```text
 ✓ src/reports/memory-repository.test.ts (4 tests)
      Tests  4 passed (4)
```

The second test is the important one: `upsert` for the same person and day
returns the **same id** and the list stays at one entry. That is D7, "one
report per person per day", enforced by replacing in place.

## What I learned 🇵🇱 Czego się nauczyłem

- `implements ReportRepository` is a promise TypeScript checks: change one
  method's signature and `pnpm typecheck` names the method and the mismatch.
  🇵🇱 _`implements ReportRepository` to obietnica, którą TypeScript sprawdza: zmień sygnaturę jednej metody, a `pnpm typecheck` wskaże metodę i rozbieżność._
- `Array.find` returns `undefined` when nothing matches; the contract says
  `null`. `?? null` at the end of `findByUserAndDay` is the whole difference,
  and the first test catches it if it is missing.
  🇵🇱 _`Array.find` zwraca `undefined`, gdy nic nie pasuje; kontrakt mówi `null`. `?? null` na końcu `findByUserAndDay` to cała różnica, a pierwszy test to łapie._
- Day strings compare correctly with `>=` and `<=` only because every day is
  `YYYY-MM-DD`. That is why D6 fixes the format.
  🇵🇱 _Napisy z dniem porównują się dobrze przez `>=` i `<=` tylko dlatego, że każdy dzień to `RRRR-MM-DD`. Po to D6 ustala format._
