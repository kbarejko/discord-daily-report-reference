# #29 Build the export file

```text
      Tests  3 passed (3)
```

```text
docs/export-sample.md written
```

## What I learned 🇵🇱 Czego się nauczyłem

- A snapshot against a hand-written file is a strong test when the file was
  reviewed first (#27). The same test against a generated file proves nothing.
  🇵🇱 _Porównanie z ręcznie napisanym plikiem to mocny test, gdy plik przeszedł review (#27). Ten sam test z plikiem wygenerowanym nie dowodzi niczego._
- Iterating days as `YYYY-MM-DD` strings with a `Date` at noon UTC avoids every
  time-zone trap met in #13.
  🇵🇱 _Iterowanie dni jako napisów `RRRR-MM-DD` z `Date` o 12:00 UTC omija każdą pułapkę strefy czasowej z #13._
