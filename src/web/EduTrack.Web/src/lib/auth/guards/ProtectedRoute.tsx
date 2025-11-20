import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { ProtectedRouteProps } from '../types'

export function ProtectedRoute({
    children,
    requiredRoles,
    fallbackPath = '/sign-in',
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth()
    const location = useLocation()

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        )
    }

    // Redirect to sign-in if not authenticated
    if (!isAuthenticated) {
        return <Navigate to={fallbackPath} state={{ from: location }} replace />
    }

    // Check role requirements
    if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some((role) => user?.roles.includes(role))

        if (!hasRequiredRole) {
            return <Navigate to="/forbidden" replace />
        }
    }

    return <>{children}</>
}
