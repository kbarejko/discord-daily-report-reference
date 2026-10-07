# #31 Edit an earlier day's report

```text
undefined    -> {"ok":true,"day":"2026-10-07"}
2026-10-07   -> {"ok":true,"day":"2026-10-07"}
2026-09-30   -> {"ok":true,"day":"2026-09-30"}
2026-09-29   -> {"ok":false,"error":"2026-09-29 to więcej niż 7 dni temu. Starsze raporty poprawia opiekun; napisz do niego."}
2026-10-08   -> {"ok":false,"error":"2026-10-08 jeszcze nie było. Raport można dodać za dziś albo za wcześniejszy dzień."}
wczoraj      -> {"ok":false,"error":"Dzień podaj jako RRRR-MM-DD, np. 2026-10-06."}
```

```text
Registered 5 command(s) on server 1557306726477201439:
  /ping
  /raport
  /moje-raporty
  /postep
  /eksport
```

## The 7-day decision 🇵🇱 Decyzja o 7 dniach

Refused, not allowed with a warning. The diary is reviewed on the daily
meeting every week; a report written two weeks late is a reconstruction, and
the mentor should know about it. Older days are fixed by the mentor on
request, with a note in the daily log. The limit is one constant,
`MAX_DAYS_BACK`, and one message.

🇵🇱 _Odrzucone, nie dozwolone z ostrzeżeniem. Dziennik jest przeglądany na daily co tydzień; raport napisany dwa tygodnie później to rekonstrukcja i opiekun powinien o niej wiedzieć. Starsze dni poprawia opiekun na prośbę, z notatką w dzienniku. Limit to jedna stała, `MAX_DAYS_BACK`, i jeden komunikat._

## What I learned 🇵🇱 Czego się nauczyłem

- A modal does not remember which command opened it. The `custom_id` is the
  only place to carry state (here: the day) from the command to the submit.
  🇵🇱 _Modal nie pamięta, która komenda go otworzyła. `custom_id` to jedyne miejsce, żeby przenieść stan (tu: dzień) z komendy do wysyłki._
