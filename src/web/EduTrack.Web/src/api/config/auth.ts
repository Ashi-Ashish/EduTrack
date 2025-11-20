/**
 * Authentication helpers for API client.
 * 
 * @module api/auth
 */

/**
 * Module-level token getter function that can be injected by AuthContext.
 * This allows the API client to retrieve tokens without direct React dependencies.
 */
let tokenGetter: (() => Promise<string | null>) | null = null;

/**
 * Sets the token getter function.
 * This should be called by AuthContext during initialization.
 * 
 * @param getter - Function that returns the current auth token
 */
export function setTokenGetter(getter: () => Promise<string | null>): void {
    tokenGetter = getter;
}

/**
 * Retrieves the authentication token for API requests.
 * Integrated with AuthContext via setTokenGetter.
 * 
 * @returns Authentication token or null if not available
 */
export async function getAuthToken(): Promise<string | null> {
    if (tokenGetter) {
        return await tokenGetter();
    }

    // Fallback to localStorage for backward compatibility (development/testing)
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
