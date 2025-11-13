export type NavItem = {
  to: string
  label: string
}

export const primaryNavigation: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
]
