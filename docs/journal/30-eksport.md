# #30 /eksport sends the file

## The follow-up request

```text
PATCH https://discord.com/api/v10/webhooks/app/tok/messages/@original
payload_json: {"content":"Dziennik…","flags":64}
files[0]: dziennik-anna.md text/markdown 19 bytes
```

## Why `after()` 🇵🇱 Dlaczego `after()`

A Vercel function may be frozen as soon as the response is sent. Work started
"in the background" with a dangling promise can simply never finish. Next's
`after(work)` registers work that runs after the response, inside the same
invocation, and the platform keeps the function alive for it. The handler
does not know about Next: it calls `ctx.defer(work)`, and the route decides
that `defer` means `after`. Tests make `defer` a queue and flush it.

🇵🇱 _Funkcja na Vercelu może zostać zamrożona, gdy tylko odpowiedź wyjdzie. Praca „w tle” z porzuconym promise'em może się po prostu nigdy nie skończyć. `after(work)` z Next rejestruje pracę po odpowiedzi, w tym samym wywołaniu, a platforma trzyma funkcję przy życiu. Handler nie wie o Next: woła `ctx.defer(work)`, a route decyduje, że `defer` to `after`. Testy robią z `defer` kolejkę i ją opróżniają._

```text
Registered 5 command(s) on server 1557306726477201439:
  /ping
  /raport
  /moje-raporty
  /postep
  /eksport
```

## What I learned 🇵🇱 Czego się nauczyłem

- A file goes to Discord as `multipart/form-data`: `payload_json` for the
  message, `files[0]` for the attachment. Node's `FormData` and `Blob` are
  enough; no library.
  🇵🇱 _Plik idzie do Discorda jako `multipart/form-data`: `payload_json` na wiadomość, `files[0]` na załącznik. `FormData` i `Blob` z Node wystarczą; bez biblioteki._
- The thing that cannot be unit-tested (the real interaction token) is
  isolated in one function with one parameter, so everything around it can.
  🇵🇱 _To, czego nie da się przetestować jednostkowo (prawdziwy token interakcji), jest odizolowane w jednej funkcji z jednym parametrem, więc wszystko dookoła się da._
