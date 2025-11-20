export type NavItem = {
  to: string
  label: string
  requiredRoles?: string[]
}

export const primaryNavigation: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  // Example role-protected navigation items:
  // { to: '/departments', label: 'Departments', requiredRoles: ['Admin', 'InstituteAdmin'] },
  // { to: '/classes', label: 'Classes', requiredRoles: ['Teacher', 'Admin'] },
  // { to: '/students', label: 'Students', requiredRoles: ['Teacher', 'Admin'] },
  // { to: '/reports', label: 'Reports', requiredRoles: ['Admin', 'SuperAdmin'] },
]

/**
 * Filters navigation items based on user roles.
 * Items without requiredRoles are always visible (public items).
 * Items with requiredRoles are only visible if the user has at least one of the required roles.
 *
 * @param items - Navigation items to filter
 * @param userRoles - Current user's roles
 * @returns Filtered navigation items
 */
export function filterNavByRoles(items: NavItem[], userRoles: string[]): NavItem[] {
  return items.filter((item) => {
    // Public item - no role requirement
    if (!item.requiredRoles || item.requiredRoles.length === 0) {
      return true
    }
    // Check if user has at least one of the required roles
    return item.requiredRoles.some((role) => userRoles.includes(role))
  })
}
