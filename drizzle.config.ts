import { defineConfig } from 'drizzle-kit'

// drizzle-kit reads .env.local itself when run through `pnpm db:*` (--env-file).
export default defineConfig({
  dialect: 'turso',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'file:./data/reports.db',
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  },
})
