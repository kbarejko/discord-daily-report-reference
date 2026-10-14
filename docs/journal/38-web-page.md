# #38 A read-only web page with the team's reports

Reopened on 2026-10-14: the decision "not built" waited for a reader outside
Discord, and the mentor became one.
🇵🇱 _Otwarte ponownie 14.10.2026: decyzja „nie budujemy” czekała na czytelnika spoza Discorda, a opiekun nim został._

## Checked locally 🇵🇱 Sprawdzone lokalnie

`pnpm build`, then `pnpm start` with `DASHBOARD_PASSWORD=test123`:

```text
$ curl -s -o /dev/null -w '%{http_code} %header{www-authenticate}' localhost:3457/raporty
401 Basic realm="raporty", charset="UTF-8"
$ curl -s -o /dev/null -w '%{http_code}' -u x:zle localhost:3457/raporty
401
$ curl -s -u opiekun:test123 localhost:3457/raporty -w '%{http_code}'
200
```

The local database had one row from the tests, user `u1`. Discord answers 404
for that id, so the page showed `u1` instead of a name: the fallback works.
🇵🇱 _Lokalna baza miała jeden wiersz z testów, użytkownik `u1`. Discord odpowiada 404 na takie id, więc strona pokazała `u1` zamiast imienia: plan awaryjny działa._

The same build without `DASHBOARD_PASSWORD`:

```text
$ curl -s -o /dev/null -w '%{http_code}' -u a:b localhost:3458/raporty
404
```

And against the Turso database of the reference deployment (text of the page,
tags removed):

```text
Raporty zespołu Konrad Barejko 13,5 h z 140 h · raportów: 2 · Do celu potrzeba 9,7 h dziennie.
Dzień Godziny Co zrobione Trudności Plan 2026-10-14 7,5 h Podłączyłem bazę Turso do deployu …
```

## What I learned 🇵🇱 Czego się nauczyłem

- In Next 16 middleware is called **proxy** (`src/proxy.ts`, `export function proxy`).
  It runs on Node.js, so `node:crypto` works there.
  🇵🇱 _W Next 16 middleware nazywa się **proxy** (`src/proxy.ts`, `export function proxy`). Działa na Node.js, więc `node:crypto` jest dostępne._
- Comparing passwords with `===` stops at the first different character, and
  the time it takes leaks how much was right. `timingSafeEqual` needs equal
  lengths: hashing both sides first gives that.
  🇵🇱 _Porównanie haseł przez `===` kończy się na pierwszym różnym znaku, a czas zdradza, ile było dobrze. `timingSafeEqual` wymaga równych długości: wcześniejsze zahashowanie obu stron to zapewnia._
- A page that is off by default (404 without a password) is safer than one
  that is on by default: forgetting a variable hides the data instead of
  publishing it.
  🇵🇱 _Strona domyślnie wyłączona (404 bez hasła) jest bezpieczniejsza niż domyślnie włączona: zapomniana zmienna ukrywa dane, zamiast je publikować._
