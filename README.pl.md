# Bot do codziennych raportów

🇬🇧 [English version](README.md)

Bot na Discorda dla zespołu Digital Vantage. Raz dziennie każdy wpisuje
`/raport`, wypełnia krótki formularz (co zrobiłem, ile godzin, problemy, plan)
i bot to zapamiętuje. Na koniec praktyk jedna komenda eksportuje wszystko do
dziennika praktyk.

Budują go dwaj praktykanci, w cztery tygodnie, jako prawdziwy projekt: zespół
będzie go używał po Waszym odejściu.

- **Jak działa i co jest już ustalone:** [docs/pl/architecture.md](docs/pl/architecture.md).
  Przeczytaj najpierw.
- **Uruchomienie na Twoim komputerze:** [docs/pl/development.md](docs/pl/development.md).
- **Produkcja na Vercelu:** [docs/pl/deploy.md](docs/pl/deploy.md).
- **Sposób pracy zespołu** (branche, commity, CHANGELOG, review) jest taki sam
  jak w [intern-playground](https://github.com/DigitalVantage/intern-playground/blob/main/README.pl.md#jak-pracujemy).

## Od czego zacząć

```bash
git clone git@github.com:DigitalVantage/discord-daily-report.git
cd discord-daily-report
nvm use && corepack enable
pnpm install
cp .env.example .env.local   # potem uzupełnij: docs/pl/development.md
pnpm dev
```

| Polecenie                | Co robi                                                                      |
| ------------------------ | ---------------------------------------------------------------------------- |
| `pnpm dev`               | serwer deweloperski na http://localhost:3000                                 |
| `pnpm lint`              | ESLint                                                                       |
| `pnpm typecheck`         | TypeScript                                                                   |
| `pnpm test`              | Vitest, powtarza testy po każdym zapisie (`pnpm test --run` uruchamia raz)   |
| `pnpm build`             | wersja produkcyjna                                                           |
| `pnpm format`            | Prettier                                                                     |
| `pnpm register-commands` | wysyła listę komend na Twój serwer testowy (po każdej zmianie komendy)       |
| `pnpm db:generate`       | zapisuje migrację ze `src/db/schema.ts` do `drizzle/` (po zmianie schematu)  |
| `pnpm db:migrate`        | stosuje migracje do `DATABASE_URL` (raz po klonie i po każdym `db:generate`) |

Kolejne polecenia pojawią się razem z zadaniami, które je dodają
(`register-commands`, `db:migrate`, …). Każde z tych zadań dopisuje swoją
linię do tej tabeli.

## Praca we dwóch

Praca jest podzielona na **dwa tory**, żeby nikt nie czekał na drugiego:

| Tor                   | Etykieta         | Co obejmuje                                           |
| --------------------- | ---------------- | ----------------------------------------------------- |
| **A: Discord**        | `track: discord` | endpoint, podpisy, komendy, formularze, odpowiedzi    |
| **B: dane i eksport** | `track: data`    | baza danych, walidacja, repozytorium, eksport, postęp |
| wspólny               | `track: shared`  | kontrakt, przypomnienia, wdrożenie, dokumentacja      |

Na pierwszy etap każdy bierze jeden tor, a **na etap 3 zamieniacie się**, żeby
obaj zobaczyli obie połowy. Tory spotykają się w jednym interfejsie,
`ReportRepository` ([architektura §3](docs/pl/architecture.md#3-moduły-i-granica-między-torami)).
Ustalcie go **razem**, w pierwszych dniach, w jednym pull requeście.

### Jak wziąć zadanie

1. Wybierz zadanie z **bieżącego etapu** (milestone), którego blokady są
   zamknięte (linia `Blocked by #…` w zadaniu).
2. **Przypisz je do siebie** i napisz komentarz „Biorę to”. Przypisanie znaczy
   „pracuję nad tym teraz”.
3. Miej **najwyżej dwa** zadania naraz. Utknąłeś na dłużej niż dzień? Odepnij
   się, napisz w komentarzu, gdzie skończyłeś, i weź coś innego.
4. Zaczynaj od `good first issue`, jeśli obszar jest dla Ciebie nowy. Zadania
   `decision` kończą się krótką, zapisaną decyzją w pull requeście, nie tylko
   kodem.

### Pull requesty i review

- Każdy pull request **najpierw sprawdza drugi praktykant**, potem opiekun.
  Review to część pracy, nie przysługa: staraj się zrobić je w pół dnia.
- Podlinkuj zadanie (`Closes #12`). Jedno zadanie, jeden pull request.
- Zmiany w kontrakcie (`ReportRepository`, typ `Report`) wymagają komentarza
  od Was obu przed merge'em, bo dotykają obu torów.

### Codziennie

- **Spotkanie o 12:00** na Google Meet (czasem trochę później).
- **Praca w dzień**, gdzieś między 9:00 a 19:00 w dni robocze, **nigdy w
  nocy**: review, na które czekasz, dzieje się w dzień.
- **Wpis w dzienniku praktyk** na koniec pracy, jako komentarz w Twoim
  przypiętym issue: [#40 Artem](https://github.com/DigitalVantage/discord-daily-report/issues/40),
  [#41 Mykyta](https://github.com/DigitalVantage/discord-daily-report/issues/41)
  (wzór jest w środku). Gdy etap 2 będzie zmergowany, używaj samego bota:
  `/raport`.
- Blokuje Cię coś, co może zrobić tylko opiekun (klucze, serwer, dostęp)?
  Napisz o tym na Discordzie tego samego dnia.

## Etapy (milestones)

| Etap                         | Termin          | Gotowe, gdy                                                    |
| ---------------------------- | --------------- | -------------------------------------------------------------- |
| **M1: Bot odpowiada**        | 9 października  | `/ping` działa od początku do końca na obu serwerach testowych |
| **M2: Raporty się zapisują** | 16 października | `/raport` zapisuje do SQLite, `/moje-raporty` je wypisuje      |
| **M3: Eksport i postęp**     | 23 października | `/eksport` tworzy plik dziennika, `/postep` pokazuje godziny   |
| **M4: Na produkcji**         | 30 października | wdrożone na Vercelu, przypomnienia włączone, zespół używa      |
