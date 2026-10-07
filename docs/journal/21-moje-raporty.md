# #21 /moje-raporty lists your last 7 reports

## The embed

```json
{
  "title": "Twoje ostatnie raporty",
  "fields": [
    {
      "name": "2026-10-07 · 7,5 h",
      "value": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx… (200 chars)"
    },
    {
      "name": "2026-10-06 · 6 h",
      "value": "Router i /ping"
    }
  ]
}
```

## Registered

```text
Registered 3 command(s) on server 1557306726477201439:
  /ping
  /raport
  /moje-raporty
```

## Discord's limits and ours 🇵🇱 Limity Discorda i nasze

| Discord                            | Ours 🇵🇱 Nasze          |
| ---------------------------------- | ---------------------- |
| 25 fields per embed                | 7 reports              |
| 1024 characters per field value    | 200, first line only   |
| 256 per field name                 | `2026-10-07 · 7,5 h`   |
| 6000 characters per embed in total | at most 7 × (20 + 200) |

## What I learned 🇵🇱 Czego się nauczyłem

- Test the limit with real data: a 1000-character report is one line of
  test code and would have broken the embed silently in production.
  🇵🇱 _Testuj limit prawdziwymi danymi: raport na 1000 znaków to jedna linia testu, a w produkcji po cichu rozwaliłby embed._
