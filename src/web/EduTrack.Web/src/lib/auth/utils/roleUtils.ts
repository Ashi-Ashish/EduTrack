/**
 * Auth utility functions
 */

/**
 * Checks if a user has at least one of the required roles.
 *
 * @param userRoles - User's current roles
 * @param requiredRoles - Roles required for access
 * @returns true if user has at least one required role, false otherwise
 */
export function hasRequiredRole(userRoles: string[], requiredRoles: string[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) {
        return true // No role requirement
    }
    return requiredRoles.some((role) => userRoles.includes(role))
}

/**
 * Checks if a user has all of the required roles.
 *
 * @param userRoles - User's current roles
 * @param requiredRoles - Roles required for access
 * @returns true if user has all required roles, false otherwise
 */
export function hasAllRequiredRoles(userRoles: string[], requiredRoles: string[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) {
        return true // No role requirement
    }
    return requiredRoles.every((role) => userRoles.includes(role))
}
