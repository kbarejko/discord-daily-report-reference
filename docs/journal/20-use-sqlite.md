# #20 Use the SQLite repository in the app

## Reports survive a restart

```text
process A saved e9214a03-50de-408f-a663-fd1584e9da1b
process B found {"done":"Zapisane w procesie A","hours":7}
```

## Who touches the database

```text
src/reports/repository.ts
src/reports/sqlite-repository.test.ts
src/reports/sqlite-repository.ts
```

## What I learned 🇵🇱 Czego się nauczyłem

- Dependency inversion in practice: the handlers were written against the
  interface in #18 and #19 and did not change by one character here. Only
  the route's one line that builds the context did.
  🇵🇱 _Odwrócenie zależności w praktyce: handlery napisane na interfejsie w #18 i #19 nie zmieniły się tu o jeden znak. Zmieniła się tylko linia w route, która buduje kontekst._
