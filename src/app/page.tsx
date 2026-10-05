export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 px-4 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">Digital Vantage</p>
      <h1 className="text-4xl font-semibold">Daily report bot</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        The bot lives at <code>/api/interactions</code>. Start with docs/architecture.md.
      </p>
    </main>
  )
}
