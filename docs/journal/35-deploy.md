# #35 Deploy to production

Written, not done: `docs/deploy.md` is the checklist; the Vercel login is
missing in the environment this reference was built in.

## What I learned 🇵🇱 Czego się nauczyłem

- Write the deploy page before the first deploy, as a checklist with the
  expected result of each step. The first real run then edits the page
  instead of inventing it under pressure.
  🇵🇱 _Napisz stronę o deployu przed pierwszym deployem, jako checklistę z oczekiwanym wynikiem każdego kroku. Pierwsze prawdziwe przejście wtedy poprawia stronę, zamiast wymyślać ją pod presją._
- The cron hour is in UTC and Poland changes the clocks on 25 October: the
  one line that will silently go wrong a month from now is written down in
  bold.
  🇵🇱 _Godzina crona jest w UTC, a Polska zmienia czas 25 października: jedyna linia, która po cichu zepsuje się za miesiąc, jest zapisana pogrubieniem._
