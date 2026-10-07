/** Every slash command the bot offers. `pnpm register-commands` sends this list to Discord (D4). */
const STRING = 3 // ApplicationCommandOptionType.String

export const commandDefinitions = [
  { name: 'ping', description: 'Sprawdza, czy bot odpowiada' },
  { name: 'raport', description: 'Dodaje lub poprawia dzisiejszy raport z pracy' },
  { name: 'moje-raporty', description: 'Pokazuje Twoje ostatnie raporty (tylko Tobie)' },
  { name: 'postep', description: 'Twoje godziny w stosunku do 140 h praktyk' },
  {
    name: 'eksport',
    description: 'Twój dziennik praktyk jako plik (domyślnie całe praktyki)',
    options: [
      {
        type: STRING,
        name: 'od',
        description: 'Od dnia, RRRR-MM-DD',
        required: false,
        min_length: 10,
        max_length: 10,
      },
      {
        type: STRING,
        name: 'do',
        description: 'Do dnia, RRRR-MM-DD',
        required: false,
        min_length: 10,
        max_length: 10,
      },
    ],
  },
]
