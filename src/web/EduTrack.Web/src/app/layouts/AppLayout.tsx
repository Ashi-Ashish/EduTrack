import { Outlet } from 'react-router-dom'

import { NavBar } from '@/app/components'
import { primaryNavigation } from '@/app/navigation'
import { SkipNavigation } from '@/shared/components/SkipNavigation'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-50">
      <SkipNavigation />
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-8 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              EduTrack
            </p>
            <p className="text-lg font-semibold text-brand-600">
              Frontend shell
            </p>
          </div>
          <NavBar items={primaryNavigation} />
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
