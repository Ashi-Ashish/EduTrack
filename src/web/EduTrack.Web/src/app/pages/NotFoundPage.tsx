import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center gap-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
        404
      </p>
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
        Not Found
      </h1>
      <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">
        We have not wired that route yet. Use the navigation above or jump back
        to the shell home page to continue exploring.
      </p>
      <Link
        to="/"
        className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
      >
        Go home
      </Link>
    </section>
  )
}
