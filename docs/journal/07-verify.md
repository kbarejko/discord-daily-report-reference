# #7 Verify the Ed25519 signature of a request

## TypeScript 6 and Uint8Array

First version of `hexToBytes` returned `new Uint8Array(hex.length / 2)`.
Tests passed. `pnpm typecheck` did not:

```text
src/discord/verify.ts(31,7): error TS2769: No overload matches this call.
      Type 'ArrayBufferLike' is not assignable to type 'ArrayBuffer'.
        Type 'SharedArrayBuffer' is missing the following properties from type 'ArrayBuffer': resizable, resize, detached, transfer, transferToFixedLength
src/discord/verify.ts(37,55): error TS2345: Argument of type 'Uint8Array<ArrayBufferLike>' is not assignable to parameter of type 'BufferSource'.
```

`crypto.subtle.importKey` and `verify` want a `BufferSource`, and since
TypeScript 5.7 a `Uint8Array` created from a length is typed as "maybe backed
by a SharedArrayBuffer". Fix: allocate the buffer explicitly and say so in the
return type.

```ts
export function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(hex.length / 2))
```

## Green

```text
 ✓ src/discord/verify.test.ts (6 tests)
      Tests  6 passed (6)
```

The tests generate their own Ed25519 key pair with
`crypto.subtle.generateKey`, sign `timestamp + body` with the private key,
and hand the public key (as hex, the way Discord shows it) to
`verifySignature`. No Discord keys involved.

## What I learned 🇵🇱 Czego się nauczyłem

- Tests passing does not mean types passing. Run `pnpm typecheck` before the
  commit; the pre-commit hook does, and it would have refused this commit.
  🇵🇱 _Zielone testy to nie zielone typy. Uruchom `pnpm typecheck` przed commitem; hook pre-commit to robi i odmówiłby tego commita._
- `try { … return await … } catch { return false }`: the `await` inside the
  `try` matters. Without it the promise rejects **after** leaving the `try`,
  and the last test ("garbage input returns false") fails with an unhandled
  rejection.
  🇵🇱 _`try { … return await … } catch { return false }`: `await` wewnątrz `try` ma znaczenie. Bez niego promise odrzuca **po** wyjściu z `try` i ostatni test („śmieci na wejściu dają false”) pada z nieobsłużonym błędem._
- The signed text is `timestamp + body` with no separator, and `body` must be
  the raw request text. Any re-serialising of the JSON changes the bytes and
  the signature stops matching. #8 reads the body with `request.text()` for
  exactly this reason.
  🇵🇱 _Podpisany tekst to `timestamp + body` bez separatora, a `body` musi być surowym tekstem żądania. Każde ponowne zapisanie JSON-a zmienia bajty i podpis przestaje pasować. #8 czyta treść przez `request.text()` dokładnie z tego powodu._
