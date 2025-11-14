/**
 * Authentication helpers for API client.
 * 
 * @module api/auth
 */

/**
 * TODO(ST1.1.3): Integrate AuthContext to automatically add Bearer token
 * 
 * Retrieves the authentication token for API requests.
 * Currently uses localStorage as a fallback for manual testing.
 * Will be replaced with proper AuthContext integration in M1.1.3.
 * 
 * @returns Authentication token or null if not available
 */
export function getAuthToken(): string | null {
    // TODO(ST1.1.3): Replace with AuthContext integration
    // Example: const { token } = useAuth();
    // For now, check localStorage as fallback for manual testing
    if (typeof localStorage === 'undefined') {
        return null;
    }

    try {
        return localStorage.getItem('auth_token');
    } catch {
        return null;
    }
}

/**
 * TODO(ST1.3.1): Integrate TenantContext to automatically add X-Tenant-Id header
 * 
 * Retrieves the current tenant ID for API requests.
 * Currently uses localStorage as a fallback for manual testing.
 * Will be replaced with proper TenantContext integration in M1.3.1.
 * 
 * @returns Tenant ID or null if not available
 */
export function getCurrentTenantId(): string | null {
    // TODO(ST1.3.1): Replace with TenantContext integration
    // Example: const { currentTenant } = useTenant();
    // For now, check localStorage as fallback for manual testing
    if (typeof localStorage === 'undefined') {
        return null;
    }

    try {
        return localStorage.getItem('tenant_id');
    } catch {
        return null;
    }
}
