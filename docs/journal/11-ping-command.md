# #11 /ping command answers "pong"

## Green

```text
 Test Files  7 passed (7)
      Tests  25 passed (25)
```

## The whole route by hand, with a signed command

A one-off script: generate a key pair, put the public key in the
environment, sign a type 2 interaction for `ping`, call `POST`:

```text
Node.js v24.16.0
```

`type: 4` is CHANNEL_MESSAGE_WITH_SOURCE, `flags: 64` is "only the caller
sees it" (D8). The number of milliseconds is the time between receiving the
request and answering.

## Still open: both test servers

The issue says "works on both test servers". That needs the app on a public
address and the Endpoint URL saved (#8); this run waits for `vercel login`.
Until then Discord still answers "The application did not respond" to
`/ping`, which is correct: nothing is deployed.

## What I learned 🇵🇱 Czego się nauczyłem

- A lookup table `{ ping, raport, … }` replaces a growing `if / else if`.
  Adding a command is one import and one line.
  🇵🇱 _Tablica `{ ping, raport, … }` zastępuje rosnące `if / else if`. Dodanie komendy to jeden import i jedna linia._
- The reply text is Polish on purpose (`Nie znam komendy /…`): the users are
  Polish. Code, commits and comments stay English.
  🇵🇱 _Tekst odpowiedzi jest celowo po polsku (`Nie znam komendy /…`): użytkownicy są polscy. Kod, commity i komentarze zostają po angielsku._
