# #14 SQLite with Drizzle: client and migrations

## pnpm and install scripts

```bash
pnpm add drizzle-orm @libsql/client
```

```text
✓ Lockfile passes supply-chain policies (verified 30m ago)
[WARN] deprecated eslint@9.39.5. 10.12.0 is not deprecated, outside the range you declared.
Packages: +13
+++++++++++++
Progress: resolved 13, reused 365, downloaded 0, added 13, done
.../node_modules/unrs-resolver postinstall: Done
dependencies:
+ @libsql/client 0.18.0
+ drizzle-orm 0.45.3
Error: ERR_PNPM_IGNORED_BUILDS
  × adding a new package
  ╰─▶ Ignored build scripts: esbuild@0.28.2
  help: Run "pnpm approve-builds" to pick which dependencies should be allowed
        to run scripts.
```

`pnpm-workspace.yaml` lists the packages allowed to run install scripts. The
old entry was `better-sqlite3` (the driver before D5 changed); now it is
`esbuild`, which drizzle-kit depends on. After the change:

```text
✓ Lockfile passes supply-chain policies (verified 174ms ago)
Lockfile is up to date, resolution step is skipped
Already up to date
.../node_modules/unrs-resolver postinstall: Done
Done in 138ms using pnpm v12.9.1
✓ Lockfile passes supply-chain policies (verified 373ms ago)
[WARN] deprecated eslint@9.39.5. 10.12.0 is not deprecated, outside the range you declared.
[WARN] 2 deprecated subdependencies found: @esbuild-kit/core-utils@3.3.2, @esbuild-kit/esm-loader@2.6.5
Packages: +11
+++++++++++
Progress: resolved 11, reused 362, downloaded 0, added 11, done
.../node_modules/unrs-resolver postinstall: Done
devDependencies:
+ drizzle-kit 0.31.11
Done in 420ms using pnpm v12.9.1
```

## The scripts, for real

```text
No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/kbarejko/projects/web/discord-daily-report-reference/drizzle.config.ts'
0 tables
No schema changes, nothing to migrate 😴
```

```text
Migrations applied to file:./data/reports.db
```

Repeated: `Migrations applied to file:./data/reports.db`. Tables in the file: `__drizzle_migrations, sqlite_autoindex___drizzle_migrations_1`.

## What I learned 🇵🇱 Czego się nauczyłem

- `ERR_PNPM_IGNORED_BUILDS` is not a broken package. It is pnpm asking for
  permission; the answer lives in `pnpm-workspace.yaml`, not in a flag.
  🇵🇱 _`ERR_PNPM_IGNORED_BUILDS` to nie zepsuta paczka. To pnpm proszący o zgodę; odpowiedź jest w `pnpm-workspace.yaml`, nie we fladze._
- The same `@libsql/client` opens `file:`, `libsql://` and `:memory:`. One
  client, three uses: laptop, Turso, tests.
  🇵🇱 _Ten sam `@libsql/client` otwiera `file:`, `libsql://` i `:memory:`. Jeden klient, trzy zastosowania: laptop, Turso, testy._
