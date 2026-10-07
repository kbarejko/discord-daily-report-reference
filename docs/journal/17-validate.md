# #17 Validate a report before it is saved

## The rules (architecture §6.2, decided here)

| Field              | Rule 🇵🇱 Reguła                                                                      |
| ------------------ | ----------------------------------------------------------------------------------- |
| `done`             | required, 3–1000 characters after trim 🇵🇱 _wymagane, 3–1000 znaków po przycięciu_   |
| `hours`            | `7`, `7.5`, `7,5`, `7 h`, `7h`; 0,25–16 🇵🇱 _te formy; zakres 0,25–16_               |
| `problems`, `plan` | optional, up to 1000; empty becomes `null` 🇵🇱 _opcjonalne, do 1000; puste → `null`_ |

Why 16 and not 24: a report is about a working day; 16 already allows for a
very long one. Why 0,25: a quarter of an hour is the smallest thing worth
writing down. Why no `7:30`: it reads as a clock time, not a duration, and
`7,5` is what the form's placeholder suggests.

## Seen

```text
      Tests  18 passed (18)
```

```text
"7"        -> 7
"7,5"      -> 7.5
"7 h"      -> 7
"7:30"     -> null
"siedem"   -> null
"17"       -> 17
{"ok":false,"errors":["Opisz, co zrobiłeś: co najmniej 3 znaki.","Godziny wpisz jako liczbę, np. 7 albo 7,5."]}
```

## What I learned 🇵🇱 Czego się nauczyłem

- Return errors, never throw: the form handler shows the list to the user
  and saves nothing. A thrown error would become "Something went wrong".
  🇵🇱 _Zwracaj błędy, nie rzucaj: handler formularza pokazuje listę użytkownikowi i nic nie zapisuje. Rzucony błąd zamieniłby się w „Coś poszło nie tak”._
- A regular expression with a comment is the whole hours grammar. Writing the
  accepted forms in the issue first made the regex obvious.
  🇵🇱 _Wyrażenie regularne z komentarzem to cała gramatyka godzin. Spisanie dozwolonych form w issue najpierw sprawiło, że regex był oczywisty._
