# #25 Count hours against the 140-hour target

```text
      Tests  5 passed (5)
```

```text
working days 2026-10-07..30: 18
{"totalHours":14.5,"targetHours":140,"workingDaysLeft":18,"hoursPerDayNeeded":7,"reportedDays":2}
```

## A wrong expectation 🇵🇱 Złe oczekiwanie

The weekend test first said `9.4` hours a day for 15 remaining days.
`140 / 15 = 9.33…`, rounded to one decimal: `9.3`. The test was written from
a guess, the code from arithmetic. The code was right.

🇵🇱 _Test weekendowy najpierw mówił `9.4` na 15 dni. `140 / 15 = 9.33…`, do jednego miejsca: `9.3`. Test napisany z przeczucia, kod z arytmetyki. Kod miał rację._

## What I learned 🇵🇱 Czego się nauczyłem

- Compute the expected value on paper before typing it into a test.
  🇵🇱 _Policz oczekiwaną wartość na kartce, zanim wpiszesz ją do testu._
- "Days left" includes today: on the last day of the internship there is
  still one day to report.
  🇵🇱 _„Dni do końca” liczy dzisiejszy: w ostatni dzień praktyk jest jeszcze jeden dzień do raportu._
