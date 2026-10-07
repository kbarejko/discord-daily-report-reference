# #15 Design the reports table

## The migration drizzle-kit wrote

```sql
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`discord_user_id` text NOT NULL,
	`day` text NOT NULL,
	`done` text NOT NULL,
	`hours` real NOT NULL,
	`problems` text,
	`plan` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reports_user_day` ON `reports` (`discord_user_id`,`day`);--> statement-breakpoint
CREATE INDEX `reports_day` ON `reports` (`day`);
```

## Applied, and read back

```text
Migrations applied to file:./data/reports.db
```

```sql
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`discord_user_id` text NOT NULL,
	`day` text NOT NULL,
	`done` text NOT NULL,
	`hours` real NOT NULL,
	`problems` text,
	`plan` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
)
CREATE UNIQUE INDEX `reports_user_day` ON `reports` (`discord_user_id`,`day`)
CREATE INDEX `reports_day` ON `reports` (`day`)
```

## D7 at the database level

Two inserts for the same `discord_user_id` and `day`:

```text
second insert refused: SQLITE_CONSTRAINT: UNIQUE constraint failed: reports.discord_user_id, reports.day
```

## Why each column is what it is 🇵🇱 Dlaczego każda kolumna jest taka

| Column                     | Type                     | Why 🇵🇱 Dlaczego                                                                                                                              |
| -------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                       | text, primary key        | a UUID from `crypto.randomUUID()`; text is what SQLite stores it as anyway 🇵🇱 _UUID z `crypto.randomUUID()`_                                 |
| `discord_user_id`          | text, not null           | Discord ids are 64-bit integers, too big for a JS number; text is safe 🇵🇱 _id Discorda nie mieści się w liczbie JS; tekst jest bezpieczny_   |
| `day`                      | text, not null           | `YYYY-MM-DD` (D6) sorts and compares as a string; `listByUser` does `>=` and `<=` on it 🇵🇱 _`RRRR-MM-DD` sortuje się i porównuje jako tekst_ |
| `done`                     | text, not null           | the one required text 🇵🇱 _jedyny wymagany tekst_                                                                                             |
| `hours`                    | real, not null           | `7.5` is allowed (#17), so not an integer 🇵🇱 _`7.5` jest dozwolone, więc nie integer_                                                        |
| `problems`, `plan`         | text, nullable           | optional in the form; `null`, not `''`, so "not given" is distinguishable 🇵🇱 _opcjonalne; `null`, nie `''`_                                  |
| `created_at`, `updated_at` | integer (ms since epoch) | Drizzle's `timestamp_ms` mode maps them to `Date`; integers compare and index well 🇵🇱 _tryb `timestamp_ms` daje `Date`_                      |

| Index                       | On                     | Why 🇵🇱 Dlaczego                                                                                                                                            |
| --------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reports_user_day` (unique) | `discord_user_id, day` | D7: the database refuses a second report for the same day, and `findByUserAndDay` is a point lookup 🇵🇱 _D7 w bazie; `findByUserAndDay` to jedno trafienie_ |
| `reports_day`               | `day`                  | `listUserIdsWithReport(day)` for the 15:00 reminder 🇵🇱 _dla przypomnienia o 15:00_                                                                         |
