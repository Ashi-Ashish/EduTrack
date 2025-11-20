import { NavLink } from 'react-router-dom'

import { DarkModeToggle } from './DarkModeToggle'
import type { NavItem } from '@/app/navigation'
import { filterNavByRoles } from '@/app/navigation'
import { useAuth } from '@/lib/auth/hooks/useAuth'
import { SignInButton } from '@/lib/auth/components/SignInButton'
import { UserMenu } from '@/lib/auth/components/UserMenu'

const navLinkClassNames = (isActive: boolean) =>
  [
    'text-sm font-semibold transition-colors',
    isActive
      ? 'text-brand-600'
      : 'text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
  ].join(' ')

type NavBarProps = {
  items: NavItem[]
  showThemeToggle?: boolean
}

type ActiveNavLinkProps = {
  item: NavItem
}

function ActiveNavLink({ item }: ActiveNavLinkProps) {
  return (
    <NavLink to={item.to} className={({ isActive }) => navLinkClassNames(isActive)}>
      {item.label}
    </NavLink>
  )
}

export function NavBar({ items, showThemeToggle = true }: NavBarProps) {
  const { isAuthenticated, isLoading, user } = useAuth()

  // Filter navigation items based on user roles
  const visibleNavItems =
    isAuthenticated && user ? filterNavByRoles(items, user.roles) : items.filter((item) => !item.requiredRoles)

  return (
    <nav aria-label="Primary" className="flex items-center gap-4">
      <ul className="flex items-center gap-4">
        {visibleNavItems.map((item) => (
          <li key={item.to}>
            <ActiveNavLink item={item} />
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3">
        {showThemeToggle ? <DarkModeToggle /> : null}
        <div className="border-l border-slate-200 dark:border-slate-700 h-6" />
        {isLoading ? (
          <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-10 w-24 rounded" />
        ) : isAuthenticated ? (
          <UserMenu />
        ) : (
          <SignInButton />
        )}
      </div>
    </nav>
  )
}
