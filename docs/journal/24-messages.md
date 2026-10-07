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

## A test that tested the wrong thing

```text
     × says "raport", never "wpis" 3ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
AssertionError: expected '{"somethingwentwrong":"coś poszło nie…' not to contain 'wpis'
      Tests  1 failed | 1 passed (2)
```

`wpis` is a substring of `wpisz`. The noun is banned, the verb is used on
purpose ("Wpisz /raport"). Fixed with a word match and Polish endings, plus
an assertion that the verb is present.

## What I learned 🇵🇱 Czego się nauczyłem

- A substring is not a word. Test the rule you mean, with the cases that
  should pass as well as the ones that should fail.
  🇵🇱 _Podciąg to nie słowo. Testuj regułę, o którą chodzi, z przypadkami, które mają przejść, i tymi, które mają paść._
- A "blocked by" is advice about order, not a law. When the other order is
  cheaper, say why in the issue and go.
  🇵🇱 _„Zablokowane przez” to rada o kolejności, nie prawo. Gdy druga kolejność jest tańsza, napisz dlaczego w issue i idź._
