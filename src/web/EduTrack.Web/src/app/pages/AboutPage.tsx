export default function AboutPage() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          About this scaffold
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Why this shell exists
        </h1>
      </header>

      <div className="space-y-4 text-base text-slate-600 dark:text-slate-300">
        <p>
          Issue #11 ensures the EduTrack frontend has a minimal, themed shell so
          the next tasks can wire APIs, accessibility linting, and auth guards
          without rebuilding layout or styling foundations.
        </p>
        <p>
          Contribute documentation, shared components, or design tokens here as
          they evolve. Keeping this page current helps every slice land fast.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Included defaults
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Responsive layout container with generous padding.</li>
          <li>Top navigation with active route highlighting.</li>
          <li>Dark-mode toggle using Tailwind&apos;s `dark` variant.</li>
          <li>Utility tokens for brand colors, typography, and spacing.</li>
        </ul>
      </div>
    </section>
  )
}
