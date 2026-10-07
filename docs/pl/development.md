# Praca na własnym komputerze

🇬🇧 [English version](../development.md)

Każdy z Was uruchamia **własną** aplikację Discord na **własnym** serwerze
testowym (decyzja D11). Discord wysyła interakcje na adres wpisany w
aplikacji, więc przy jednej wspólnej aplikacji zabieralibyście sobie nawzajem
żądania.

## 1. Twój serwer testowy

W Discordzie: **+** (Dodaj serwer) → _Stwórz własny_ → _Dla mnie i znajomych_.
Nazwij go np. `dv-bot-dev-anna`. Potem włącz _Ustawienia użytkownika →
Zaawansowane → Tryb dewelopera_, kliknij prawym przyciskiem na serwer →
_Kopiuj ID serwera_ i wpisz je w `.env.local` jako `DISCORD_GUILD_ID`.

## 2. Twoja aplikacja deweloperska

1. Wejdź na [discord.com/developers/applications](https://discord.com/developers/applications)
   → _New Application_, np. `DV Daily Report (dev, Anna)`.
2. _General Information_: skopiuj **Application ID** → `DISCORD_APPLICATION_ID`
   i **Public Key** → `DISCORD_PUBLIC_KEY`.
3. _Bot_ → _Reset Token_, skopiuj go raz → `DISCORD_BOT_TOKEN`. To hasło:
   trafia tylko do `.env.local`, nigdy do commita, issue ani wiadomości na
   Discordzie.
4. _OAuth2 → URL Generator_: scopes `bot` + `applications.commands`,
   uprawnienie bota _Send Messages_. Otwórz wygenerowany adres i dodaj bota
   do swojego serwera testowego.

## 3. Publiczny adres Twojego bota: własny deploy na Vercelu

Discord nie może zawołać `localhost:3000`, więc Twój bot potrzebuje adresu w
internecie. Każdy z Was wdraża **własną kopię** aplikacji na darmowe konto
Vercel (D12). Adres się nie zmienia, więc wpisujesz go w Developer Portal raz.

Raz:

1. Załóż darmowe konto na [vercel.com/signup](https://vercel.com/signup)
   przez **Continue with GitHub**. Darmowy plan (Hobby) wystarczy.
2. Zainstaluj narzędzie w terminalu Ubuntu i zaloguj się:
   ```bash
   npm install -g vercel
   vercel login
   ```
   Wybierz **Continue with GitHub** i potwierdź w przeglądarce.
   `vercel whoami` wypisze potem Twoją nazwę.
3. W folderze projektu utwórz swój projekt na Vercelu i daj mu pięć ustawień
   z `.env.local` (jedno polecenie na zmienną; wklej wartość, gdy zapyta,
   podczas wklejania nic się nie wyświetla):
   ```bash
   cd ~/projects/discord-daily-report
   vercel link            # Set up? Y → Twoje konto → Link to existing project? N → nazwa: dv-bot-dev-<imię>
   vercel env add DISCORD_APPLICATION_ID production
   vercel env add DISCORD_PUBLIC_KEY production
   vercel env add DISCORD_BOT_TOKEN production
   vercel env add DISCORD_GUILD_ID production
   vercel env add CRON_SECRET production
   ```
   `vercel link` tworzy folder `.vercel/` i dopisuje go do `.gitignore`. Są w
   nim tylko identyfikatory projektu, ale i tak nie wrzucaj go do commitów.

Za każdym razem, gdy Discord ma zobaczyć Twój aktualny kod:

```bash
pnpm test --run && pnpm build    # złap błędy tutaj, nie po deployu
vercel --prod
```

✅ Ostatnia linia to `Production: https://dv-bot-dev-<imię>.vercel.app`. To adres
Twojego bota. Deploy trwa około minuty.

W Developer Portal → _General Information_ → **Interactions Endpoint URL**
wpisz `https://dv-bot-dev-<imię>.vercel.app/api/interactions` i zapisz. Discord
najpierw wysyła testowe żądanie ze złym podpisem. Zapis uda się dopiero, gdy
Twój endpoint odpowiada na PING i odrzuca złe podpisy (etap 1). Do tego czasu
pole się nie zapisze i tak ma być.

Logi wdrożonego bota: `vercel logs https://dv-bot-dev-<imię>.vercel.app` albo
zakładka **Logs** na vercel.com. Obsługa, która rzuciła błąd, jest tam widoczna.

> **Dlaczego nie tunel do laptopa?** Też działa
> (`cloudflared tunnel --url http://localhost:3000`), ale adres zmienia się
> przy każdym uruchomieniu i to jeszcze jedno narzędzie. Deploy kosztuje
> minutę; logika jest testowana lokalnie przez vitest, więc do Discorda idzie
> się dopiero, gdy logika już działa.

## 4. Komendy

Po zmianie definicji komendy:

```bash
pnpm register-commands   # dochodzi w etapie 1
```

Komendy zarejestrowane na serwerze testowym pojawiają się od razu. Jeśli
którejś brakuje, naciśnij `Ctrl+R` w Discordzie.

## 5. Gdy coś nie działa

| Objaw                                  | Zwykle                                                                                                           |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| „The application did not respond”      | Obsługa rzuciła błąd albo trwała ponad 3 s. Zajrzyj do `vercel logs` (albo do terminala `pnpm dev` przy tunelu). |
| Endpoint URL nie chce się zapisać      | Zmieniłeś kod, ale nie zrobiłeś `vercel --prod`, ścieżka jest zła albo sprawdzenie podpisu nie przechodzi.       |
| Discord dalej widzi stare zachowanie   | Uruchom `vercel --prod` jeszcze raz i poczekaj na `Production:`, zanim spróbujesz.                               |
| `vercel --prod` wywala się na buildzie | Uruchom `pnpm build` lokalnie i przeczytaj pierwszy błąd. Wdrożony build ma ten sam kod.                         |
| `401` na każde żądanie                 | `DISCORD_PUBLIC_KEY` jest z innej aplikacji.                                                                     |
| Komendy nie ma na liście               | Niezarejestrowana na tym serwerze (`pnpm register-commands`) albo Discord potrzebuje `Ctrl+R`.                   |
| Zmiany w `.env.local` są ignorowane    | Uruchom `pnpm dev` ponownie.                                                                                     |
