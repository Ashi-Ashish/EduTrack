import { NavLink } from 'react-router-dom'

import { DarkModeToggle } from './DarkModeToggle'
import type { NavItem } from '@/app/navigation'

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
  return (
    <nav aria-label="Primary" className="flex items-center gap-4">
      <ul className="flex items-center gap-4">
        {items.map((item) => (
          <li key={item.to}>
            <ActiveNavLink item={item} />
          </li>
        ))}
      </ul>
      {showThemeToggle ? <DarkModeToggle /> : null}
    </nav>
  )
}
