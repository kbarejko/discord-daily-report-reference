# #13 One function for "today" in Europe/Warsaw

## Red first

The test file was written before the function. First run:

```bash
pnpm test --run src/reports/day.test.ts
```

```text
Error: Cannot find module './day' imported from /home/…/discord-daily-report-reference/src/reports/day.test.ts
 Test Files  1 failed (1)
```

Expected: the file does not exist yet. The message says exactly that.

## Green

After `src/reports/day.ts`:

```text
 ✓ src/reports/day.test.ts (4 tests)
 Test Files  1 passed (1)
      Tests  4 passed (4)
```

## Seen with my own eyes

```bash
node -e "console.log(new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Warsaw',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date('2026-10-07T22:00:00Z')))"
```

```text
2026-10-08
```

22:00 UTC on 7 October is already 8 October in Warsaw (summer time, UTC+2).

## What I learned 🇵🇱 Czego się nauczyłem

- `en-CA` is used only because its default date format is `YYYY-MM-DD`. No
  library needed for time zones; `Intl.DateTimeFormat` does it.
  🇵🇱 _`en-CA` jest tylko dlatego, że jego domyślny format daty to `RRRR-MM-DD`. Strefy czasowe nie potrzebują biblioteki; `Intl.DateTimeFormat` to załatwia._
- `isWorkingDay` builds the date at **noon UTC** on purpose: midnight UTC is
  already the next day in Warsaw, and `getUTCDay()` would be off by one on
  some days. `getDay()` was never an option: it uses the computer's zone, so
  tests would pass on a laptop in Warsaw and fail on Vercel in UTC.
  🇵🇱 _`isWorkingDay` buduje datę o **12:00 UTC** celowo: północ UTC to w Warszawie już następny dzień i `getUTCDay()` myliłby się o jeden w niektóre dni. `getDay()` nigdy nie wchodził w grę: bierze strefę komputera, więc testy przeszłyby na laptopie w Warszawie, a nie na Vercelu w UTC._
