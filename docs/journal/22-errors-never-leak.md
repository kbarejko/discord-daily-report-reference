# #22 Errors never leak to Discord

## A throwing repository, through the wrapper

```text
at Module.handleInteraction (/home/kbarejko/projects/web/discord-daily-report-reference/src/discord/handle.ts:24:20)
    at [eval]:29:21
response: {"type":4,"data":{"content":"Coś poszło nie tak. Spróbuj jeszcze raz za chwilę; jeśli to się powtarza, napisz do opiekuna.","flags":64}}
```

## Why PING stays outside the try 🇵🇱 Dlaczego PING jest poza `try`

Discord's PING is the health check it sends when the endpoint URL is saved.
If answering it could ever turn into "Coś poszło nie tak", the Portal would
refuse the URL with no hint why. It returns PONG before anything can fail.

🇵🇱 _PING Discorda to sprawdzenie, które wysyła przy zapisie adresu endpointu. Gdyby odpowiedź na nie mogła zamienić się w „Coś poszło nie tak”, Portal odrzuciłby adres bez podpowiedzi dlaczego. Zwraca PONG, zanim cokolwiek może się nie udać._

## What I learned 🇵🇱 Czego się nauczyłem

- One `try` around the router is enough. Handlers stay free of error
  handling and the policy lives in one place.
  🇵🇱 _Jedno `try` wokół routera wystarczy. Handlery są wolne od obsługi błędów, a polityka mieszka w jednym miejscu._
- The test asserts what is **not** in the response (`SQLITE`, `at `) as much
  as what is.
  🇵🇱 _Test sprawdza, czego **nie ma** w odpowiedzi (`SQLITE`, `at `), tak samo jak to, co jest._
