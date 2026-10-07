# #24 All bot texts in one file

Pulled forward, before #17: deciding the voice first means no refactor later.

## The decisions

- **raport**, never _wpis_. A test checks the whole file for the word.
- Hours are shown as `7,5 h`: Polish decimal comma, a space before `h`.
- Confirmations say what was saved and for which day, so a wrong day is
  visible immediately.
- The error message says what to do (try again, then tell the mentor), not
  what happened.

## Nothing left behind

```text
(no user-facing literal left in src/discord)
```

## What I learned 🇵🇱 Czego się nauczyłem

- A "blocked by" is advice about order, not a law. When the other order is
  cheaper, say why in the issue and go.
  🇵🇱 _„Zablokowane przez” to rada o kolejności, nie prawo. Gdy druga kolejność jest tańsza, napisz dlaczego w issue i idź._
