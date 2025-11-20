/**
 * Re-export useAuth hook for convenient importing.
 * 
 * Usage:
 * ```typescript
 * import { useAuth } from '@/lib/auth/hooks/useAuth';
 * 
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   // ...
 * }
 * ```
 */
export { useAuth } from '../context/AuthContext';
