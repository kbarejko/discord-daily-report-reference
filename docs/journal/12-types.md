# #12 TypeScript types for the interactions we use

## The typo test

The point of named constants is that a wrong name fails before the code
runs. Added on purpose, then removed:

```ts
export const typo: typeof InteractionType.Pong = 1
```

```bash
pnpm typecheck
```

```text
src/discord/types.ts(71,43): error TS2339: Property 'Pong' does not exist on type '{ readonly Ping: 1; readonly ApplicationCommand: 2; readonly ModalSubmit: 5; }'.
```

`Pong` is a **response** type, not an interaction type. With bare numbers
(`type === 1`) this mistake would have compiled and answered the wrong thing.

## Green

```text
 ✓ src/discord/types.test.ts (3 tests)
      Tests  3 passed (3)
```

## What I learned 🇵🇱 Czego się nauczyłem

- `as const` turns `{ Ping: 1 }` into "exactly 1", so `typeof InteractionType.Ping`
  can be used as a type. Without it the value is "any number".
  🇵🇱 _`as const` zamienia `{ Ping: 1 }` w „dokładnie 1”, więc `typeof InteractionType.Ping` nadaje się na typ. Bez tego wartość to „dowolna liczba”._
- Discord puts the user under `member.user` on a server and under `user` in a
  DM. `userOf` hides that difference in one place; every command will call it.
  🇵🇱 _Discord daje użytkownika w `member.user` na serwerze, a w `user` w wiadomości prywatnej. `userOf` chowa tę różnicę w jednym miejscu; każda komenda będzie go wołać._
