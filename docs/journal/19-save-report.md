# #19 Save the report when the form is submitted

## Three submissions

```text
Raport nie został zapisany. Popraw: | • Opisz, co zrobiłeś: co najmniej 3 znaki. | • Godziny wpisz jako liczbę, np. 7 albo 7,5.
Zapisano raport za 2026-10-07: 7,5 h. |  | Endpoint PING i router
Zapisano raport za 2026-10-07: 8 h. | Wcześniejszy raport z tego dnia został zastąpiony. |  | Endpoint PING, router i formularz
{"discordUserId":"u1","day":"2026-10-07","done":"Endpoint PING, router i formularz","hours":8,"problems":null,"plan":null,"id":"810aea02-34f6-4f7d-b559-ec0f1a864f05","createdAt":"2026-10-07T09:25:34.859Z","updatedAt":"2026-10-07T09:25:34.860Z"}
```

## By custom_id, not by position 🇵🇱 Po `custom_id`, nie po pozycji

Discord sends the modal's values as rows of components. `fieldsOf` flattens
them into `{ done, hours, problems, plan }` by `custom_id`. If the form's
field order changes in #18, nothing here changes.

🇵🇱 _Discord wysyła wartości modala jako wiersze komponentów. `fieldsOf` spłaszcza je do `{ done, hours, problems, plan }` po `custom_id`. Jeśli kolejność pól w #18 się zmieni, tu nic się nie zmienia._

## What I learned 🇵🇱 Czego się nauczyłem

- Tell the user when their earlier report was replaced. Silent replacement
  looks like a bug to the person who typed two different things.
  🇵🇱 _Powiedz użytkownikowi, gdy jego wcześniejszy raport został zastąpiony. Ciche zastąpienie wygląda jak błąd dla kogoś, kto wpisał dwie różne rzeczy._
