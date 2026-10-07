# #8 Answer PING at /api/interactions

## No server in the test

The test never starts Next.js. It builds a `Request` itself, signs
`timestamp + body` with a key pair it generated, and calls the exported
`POST` function directly:

```bash
pnpm test --run src/app
```

```text
      Tests  2 passed (2)
```

The one thing to set up before the first request is the environment:
`getEnv()` reads `process.env` on first use, so the test puts the generated
public key there with `vi.stubEnv` in `beforeAll`.

## The handler by hand

An unsigned request, straight into the function with the real `.env.local`:

```bash
pnpm exec tsx --env-file=.env.local -e "import('./src/app/api/interactions/route.ts').then(async m => { const r = await m.POST(new Request('http://localhost/api/interactions', { method: 'POST', body: '{\"type\":1}' })); console.log(r.status, await r.text()) })"
```

```text
401 {"error":"invalid request signature"}
```

## Still open: the Developer Portal

Saving the Interactions Endpoint URL needs the app on a public address.
This run has no `vercel login` yet, so that step, and the screenshot the
issue asks for, wait. The code path is the same one the test exercises:
Discord sends a PING (type 1) and a request with a bad signature, and
expects `{"type":1}` and a 401.

## What I learned 🇵🇱 Czego się nauczyłem

- Read the body with `request.text()` **before** `JSON.parse`. The signature
  covers the exact bytes; parse first and re-serialise, and it never
  matches.
  🇵🇱 _Czytaj treść przez `request.text()` **przed** `JSON.parse`. Podpis obejmuje dokładne bajty; sparsuj najpierw i zapisz ponownie, a nigdy się nie zgodzi._
- A Route Handler is a plain function. Testing it is calling it.
  🇵🇱 _Route Handler to zwykła funkcja. Testowanie to jej wywołanie._
- `request.headers.get()` gives `null` for a missing header; `?? ''` turns
  it into something `verifySignature` rejects cleanly instead of crashing on.
  🇵🇱 _`request.headers.get()` daje `null` przy braku nagłówka; `?? ''` zamienia to w coś, co `verifySignature` czysto odrzuca, zamiast się wywalić._

## Later the same day: the Portal says yes

Saved through Discord's API instead of the browser form. `PATCH /applications/@me`
with the bot token; Discord sends a PING and a badly signed request to the
URL before it answers:

```bash
curl -s -X PATCH -H "Authorization: Bot $T" -H 'Content-Type: application/json' \
  -d '{"interactions_endpoint_url":"https://dv-bot-dev-reference.vercel.app/api/interactions"}' \
  https://discord.com/api/v10/applications/@me
```

```json
{
  "name": "DV Daily Report (reference)",
  "interactions_endpoint_url": "https://dv-bot-dev-reference.vercel.app/api/interactions",
  "message": null,
  "code": null,
  "errors": null
}
```

`interactions_endpoint_url` echoed back means the deployment answered PONG
and rejected the bad signature. The same thing the Portal's **Save Changes**
does, without a screenshot.
