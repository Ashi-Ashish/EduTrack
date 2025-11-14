export default function HomePage() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Milestone M0.2
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          EduTrack Home
        </h1>
        <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
          This Tailwind + Vite shell validates routing, theming, and responsive
          layout so future feature teams can focus on domain UI instead of setup.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Ready to use
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-500" />
              Tailwind v4 utilities with brand tokens + typography defaults.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-500" />
              React Router demo routes (`/`, `/about`) and fallback 404.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-500" />
              Dark-mode toggle controlling the root `dark` class.
            </li>
          </ul>
        </article>

        <article className="rounded-3xl border border-brand-500/20 bg-brand-50/60 p-6 shadow-sm dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-brand-600 dark:text-brand-100">
            Next up
          </h2>
          <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
            HTTP client helpers, accessibility linting, and auth flows build on
            this shell next. Update this card as the milestone progresses.
          </p>
        </article>
      </div>
    </section>
  )
}
