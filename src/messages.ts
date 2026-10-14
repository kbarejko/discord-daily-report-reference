/** Every sentence the bot says, in one place (architecture §6.4). Polish, "raport" everywhere, never "wpis". */
export const messages = {
  unknownCommand: (name: string) => `Nie znam komendy /${name}.`,
  somethingWentWrong:
    'Coś poszło nie tak. Spróbuj jeszcze raz za chwilę; jeśli to się powtarza, napisz do opiekuna.',
  pong: (ms: number) => `pong (${ms} ms)`,

  form: {
    title: (day: string) => `Raport za ${day}`,
    done: 'Co zrobiłem',
    donePlaceholder: 'Krótko, po jednym punkcie w linii',
    hours: 'Ile godzin',
    hoursPlaceholder: 'np. 7 albo 7,5',
    problems: 'Co było trudne (opcjonalnie)',
    plan: 'Plan na jutro (opcjonalnie)',
  },

  validation: {
    doneTooShort: 'Opisz, co zrobiłeś: co najmniej 3 znaki.',
    doneTooLong: 'Opis „co zrobiłem” ma najwyżej 1000 znaków.',
    hoursNotANumber: 'Godziny wpisz jako liczbę, np. 7 albo 7,5.',
    hoursOutOfRange: 'Godziny muszą być między 0,25 a 16.',
    problemsTooLong: 'Pole „co było trudne” ma najwyżej 1000 znaków.',
    planTooLong: 'Pole „plan na jutro” ma najwyżej 1000 znaków.',
  },

  saved: (day: string, hours: number) => `Zapisano raport za ${day}: ${formatHours(hours)}.`,
  savedReplaced: 'Wcześniejszy raport z tego dnia został zastąpiony.',
  notSaved: 'Raport nie został zapisany. Popraw:',

  progress: (
    bar: string,
    p: {
      totalHours: number
      targetHours: number
      workingDaysLeft: number
      hoursPerDayNeeded: number
      reportedDays: number
    },
  ) =>
    [
      `${bar} ${formatHours(p.totalHours).replace(' h', '')} / ${p.targetHours} h`,
      `Raportów: ${p.reportedDays}. Dni roboczych do końca (łącznie z dziś): ${p.workingDaysLeft}.`,
      p.hoursPerDayNeeded > 0
        ? `Żeby dojść do ${p.targetHours} h, potrzeba ${formatHours(p.hoursPerDayNeeded)} dziennie.`
        : p.totalHours >= p.targetHours
          ? 'Cel osiągnięty.'
          : 'Praktyki się skończyły.',
    ].join('\n'),

  export: {
    thinking: 'Przygotowuję plik…',
    ready: (from: string, to: string, count: number) =>
      `Dziennik za ${from} – ${to}: ${count} ${reportNoun(count)}.`,
    empty: (from: string, to: string) =>
      `Brak raportów za ${from} – ${to}. Plik zawiera same puste dni.`,
    badRange: 'Daty podaj jako RRRR-MM-DD, „od” nie później niż „do”.',
  },

  raportDay: {
    future: (day: string) =>
      `${day} jeszcze nie było. Raport można dodać za dziś albo za wcześniejszy dzień.`,
    tooOld: (day: string, limit: number) =>
      `${day} to więcej niż ${limit} dni temu. Starsze raporty poprawia opiekun; napisz do niego.`,
    badDate: 'Dzień podaj jako RRRR-MM-DD, np. 2026-10-06.',
  },

  /** Posted publicly in the channel at 15:00 on working days, naming only the people without a report (D8, D9). */
  reminder: (today: string, mentions: string[]) =>
    `Przypomnienie: ${mentions.join(', ')}, za ${today} nie ma jeszcze raportu. Wpisz /raport przed końcem pracy.`,

  myReports: {
    title: 'Twoje ostatnie raporty',
    empty: 'Nie masz jeszcze żadnego raportu. Wpisz /raport, żeby dodać dzisiejszy.',
    line: (day: string, hours: number) => `${day} · ${formatHours(hours)}`,
  },

  /** The read-only web page for the mentor (#38). */
  teamPage: {
    passwordNeeded: 'Ta strona wymaga hasła.',
    title: 'Raporty zespołu',
    empty: 'Nie ma jeszcze żadnego raportu.',
    summary: (p: { totalHours: number; targetHours: number; reportedDays: number }) =>
      `${formatHours(p.totalHours)} z ${p.targetHours} h · raportów: ${p.reportedDays}`,
    perDayNeeded: (hours: number) => `Do celu potrzeba ${formatHours(hours)} dziennie.`,
    columns: {
      day: 'Dzień',
      hours: 'Godziny',
      done: 'Co zrobione',
      problems: 'Trudności',
      plan: 'Plan',
    },
  },
} as const

/** 1 raport, 2–4 / 22–24 raporty, otherwise raportów (12–14 too). */
function reportNoun(count: number): string {
  if (count === 1) return 'raport'
  const lastDigit = count % 10
  const lastTwo = count % 100
  return lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'raporty' : 'raportów'
}

/** 7 → "7 h", 7.5 → "7,5 h": Polish decimal comma. */
export function formatHours(hours: number): string {
  return `${String(hours).replace('.', ',')} h`
}
