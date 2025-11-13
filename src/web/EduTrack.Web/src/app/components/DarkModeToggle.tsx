import { useEffect, useState } from 'react'

// Persisted storage key so we can remember a manual theme override across visits
const THEME_STORAGE_KEY = 'edutrack-theme'
type ThemePreference = 'dark' | 'light'

const prefersDark = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

// Read a previously stored preference (if any)
const getStoredPreference = (): ThemePreference | null => {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage?.getItem(THEME_STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    return null
  }
}

// Write/remove the preference without breaking when storage is unavailable
const persistPreference = (value: ThemePreference | null) => {
  if (typeof window === 'undefined') return
  try {
    if (value) {
      window.localStorage?.setItem(THEME_STORAGE_KEY, value)
    } else {
      window.localStorage?.removeItem(THEME_STORAGE_KEY)
    }
  } catch {
    // Best-effort persistence (storage may be unavailable)
  }
}

export function DarkModeToggle() {
  // Track whether the user has explicitly picked a theme this session
  const [hasManualPreference, setHasManualPreference] = useState(() => getStoredPreference() !== null)
  const [isDark, setIsDark] = useState(() => {
    const storedTheme = getStoredPreference()
    if (storedTheme) return storedTheme === 'dark'
    return prefersDark()
  })

  // Sync the DOM + storage whenever the resolved theme changes
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    root.dataset.theme = isDark ? 'dark' : 'light'
    persistPreference(hasManualPreference ? (isDark ? 'dark' : 'light') : null)
  }, [isDark, hasManualPreference])

  // React to OS theme changes unless the user already set a manual override
  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (hasManualPreference) return
      setIsDark(event.matches)
    }

    if (media.addEventListener) {
      media.addEventListener('change', handleChange)
      return () => {
        media.removeEventListener('change', handleChange)
      }
    }

    media.onchange = handleChange
    return () => {
      if (media.onchange === handleChange) {
        media.onchange = null
      }
    }
  }, [hasManualPreference])

  const handleToggle = () => {
    setHasManualPreference(true)
    setIsDark((state) => !state)
  }

  return (
    <button
      type="button"
      aria-pressed={isDark}
      onClick={handleToggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-600 dark:text-slate-200"
    >
      <span className="sr-only">Toggle dark mode</span>
      {isDark ? 'Dark' : 'Light'} mode
    </button>
  )
}
