import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // The first tests arrive with milestone 1; until then an empty suite is not a failure.
  test: { include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'], passWithNoTests: true },
})
