/**
 * User information extracted from JWT token
 */
export interface User {
    id: string;
    email: string;
    name: string;
    roles: string[];
    tenantId?: string;
}

/**
 * Authentication state
 */
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

/**
 * Auth context value with actions
 */
export interface AuthContextValue extends AuthState {
    login: () => Promise<void>;
    logout: () => Promise<void>;
    acquireToken: () => Promise<string | null>;
}

/**
 * Protected route props
 */
export interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
    fallbackPath?: string;
}
