# #18 /raport opens the report form

## The modal, as JSON

```json
"title": "Raport za 2026-10-07",
    "components": [
      {
        "type": 1,
        "components": [
          {
            "type": 4,
            "custom_id": "done",
            "label": "Co zrobiłem",
            "style": 2,
            "required": true,
            "min_length": 3,
            "max_length": 1000,
            "placeholder": "Krótko, po jednym punkcie w linii"
          }
        ]
      },
      {
        "type": 1,
        "components": [
          {
            "type": 4,
            "custom_id": "hours",
            "label": "Ile godzin",
            "style": 1,
            "required": true,
            "max_length": 6,
            "placeholder": "np. 7 albo 7,5"
          }
        ]
      },
      {
        "type": 1,
        "components": [
          {
            "type": 4,
            "custom_id": "problems",
            "label": "Co było trudne (opcjonalnie)",
            "style": 2,
            "required": false,
            "max_length": 1000
          }
        ]
      },
      {
        "type": 1,
        "components": [
          {
            "type": 4,
            "custom_id": "plan",
            "label": "Plan na jutro (opcjonalnie)",
            "style": 2,
            "required": false,
            "max_length": 1000
          }
        ]
      }
    ]
  }
}
```

## Registered

```text
Registered 2 command(s) on server 1557306726477201439:
  /ping
  /raport
```

## Why a context 🇵🇱 Dlaczego kontekst

`/raport` must read today's report to pre-fill the form (D7). A handler that
imports the database directly cannot be tested without one, and cannot be
pointed at the in-memory repository until SQLite is wired (#20). So every
handler receives `ctx = { reports, now }`; the route builds it once per
request, tests build their own with a pinned clock.

🇵🇱 _`/raport` musi odczytać dzisiejszy raport, żeby wypełnić formularz (D7). Handler importujący bazę bezpośrednio nie da się przetestować bez niej ani skierować na repozytorium w pamięci, dopóki SQLite nie jest podpięte (#20). Dlatego każdy handler dostaje `ctx = { reports, now }`; route buduje go raz na żądanie, testy budują własny z zatrzymanym zegarem._

## Discord's limits that shaped the form 🇵🇱 Limity Discorda

- at most 5 text inputs per modal (we use 4); 🇵🇱 _najwyżej 5 pól (mamy 4)_
- label ≤ 45 characters (a test checks every label); 🇵🇱 _etykieta ≤ 45 znaków (test sprawdza każdą)_
- `max_length` ≤ 4000; ours are 1000 and 6, matching #17. 🇵🇱 _`max_length` ≤ 4000; nasze 1000 i 6, jak w #17_
