# #6 Validate environment variables at startup

Two mistakes, both caught by running things rather than by reading them.

## Mistake 1: parsing at import time

The first version ended with `export const env = parseEnv(process.env)`.
Then the whole suite:

```bash
pnpm test --run
```

```text
    throw new Error(`Missing or empty environment variables: ${names}`)
 ❯ src/env.ts:28:20
 ❯ src/env.test.ts:3:1

 Test Files  1 failed | 5 passed (6)
```

Line 3 of the test file is the `import`. The test never got to run: importing
`env.ts` already parsed `process.env`, which in a test has none of the
variables. The same line would have made `pnpm build` need real secrets.

Fix: a lazy getter.

```ts
let cached: Env | undefined
export function getEnv(): Env {
  cached ??= parseEnv(process.env)
  return cached
}
```

Nothing happens at import. The first caller pays for the parse, every later
caller gets the cached object.

## Mistake 2: an optional variable that is empty

`.env.local` is copied from `.env.example`, which ships
`DATABASE_AUTH_TOKEN=` as an empty line. The schema said
`z.string().min(1).optional()`. Against a freshly copied file:

```text
Error: Missing or empty environment variables: DISCORD_BOT_TOKEN, DATABASE_AUTH_TOKEN
```

`DISCORD_BOT_TOKEN` was really missing at that moment. `DATABASE_AUTH_TOKEN`
was not: `''` is a string, so `.optional()` did not apply, and `.min(1)`
rejected it. Fix: `z.string().optional().transform((v) => v || undefined)`,
and a fourth test, "accepts an empty optional variable, as .env.example ships
it".

## Also

```text
21:33  warning  '_omitted' is assigned a value but never used  @typescript-eslint/no-unused-vars
```

The first "names the missing variable" test removed a key with destructuring
and left an unused variable. Replaced with `{ ...valid, DISCORD_PUBLIC_KEY: undefined }`,
which reads better anyway.

## Green

```text
 ✓ src/env.test.ts (4 tests)
      Tests  4 passed (4)
```

## What I learned 🇵🇱 Czego się nauczyłem

- A module must not do work when it is imported. Tests, builds and other
  modules import it in situations you did not plan for.
  🇵🇱 _Moduł nie może wykonywać pracy przy imporcie. Testy, build i inne moduły importują go w sytuacjach, których nie planowałeś._
- The template ships empty values, so every optional setting must accept
  `''`. Test with a file copied from the template, not with hand-made input.
  🇵🇱 _Szablon ma puste wartości, więc każde ustawienie opcjonalne musi przyjmować `''`. Testuj na pliku skopiowanym z szablonu, nie na danych zrobionych ręcznie._
