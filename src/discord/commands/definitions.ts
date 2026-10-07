/** Every slash command the bot offers. `pnpm register-commands` sends this list to Discord (D4). */
export const commandDefinitions = [
  { name: 'ping', description: 'Sprawdza, czy bot odpowiada' },
  { name: 'raport', description: 'Dodaje lub poprawia dzisiejszy raport z pracy' },
  { name: 'moje-raporty', description: 'Pokazuje Twoje ostatnie raporty (tylko Tobie)' },
  { name: 'postep', description: 'Twoje godziny w stosunku do 140 h praktyk' },
]
