# #32 Reminder endpoint for missing reports

## The real run

```text
Node.js v24.16.0
```

## Decision D13 🇵🇱 Decyzja D13

The reminder goes through the channel's webhook. The bot token would also
work (`POST /channels/{id}/messages`), but then the token needs the right
permission on the right channel, and a leaked token can post anywhere the
bot can. A webhook URL can post to one channel and nothing else, and it is
one setting instead of two.

🇵🇱 _Przypomnienie idzie przez webhook kanału. Token bota też by zadziałał, ale wtedy potrzebuje właściwego uprawnienia na właściwym kanale, a wyciek tokenu pozwala pisać wszędzie, gdzie bot może. Adres webhooka pisze na jeden kanał i nic więcej, i to jedno ustawienie zamiast dwóch._

## Two details worth knowing 🇵🇱 Dwa szczegóły

- `timingSafeEqual` after a length check: a wrong secret takes as long to
  refuse as a right one takes to accept.
  🇵🇱 _`timingSafeEqual` po sprawdzeniu długości: zły sekret odrzuca się tak samo długo, jak dobry przyjmuje._
- `allowed_mentions: { parse: ['users'] }`: the message can ping the people
  named and never `@everyone`, even if someone types it into a report.
  🇵🇱 _`allowed_mentions: { parse: ['users'] }`: wiadomość może pingować wymienione osoby i nigdy `@everyone`, nawet gdyby ktoś wpisał to w raporcie._
- The `Headers` API trims values. A test with a trailing space tested
  nothing.
  🇵🇱 _`Headers` przycina wartości. Test ze spacją na końcu niczego nie testował._

## Regression, found in #36 🇵🇱 Regresja, znaleziona w #36

```text
    throw new Error(`Missing or empty environment variables: ${names}`)
Error: Missing or empty environment variables: DATABASE_AUTH_TOKEN
```

This pull request rewrote `src/env.ts` from an older copy without the #6 fix
and dropped the test for it. Restored in the `fix(env)` pull request. The
lesson is in the issue comment: diff against `main`, and never drop a test
silently.

## On the deployment: 500 until there is a database

```text
 <- right secret 500
```

`DATABASE_URL` on the test deployment is a scratch file without tables, so
`listUserIdsWithReport` throws and the route answers 500. That is the right
answer for a cron run that cannot do its job (Vercel shows it as failed), and
it goes away with Turso.
