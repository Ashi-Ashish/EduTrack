/**
 * Request header building utilities.
 * 
 * @module api/headers
 */

import { getAuthToken, getCurrentTenantId } from './auth';
import { generateCorrelationId } from '../core/utils';

/**
 * Builds request headers including auth token, tenant ID, and correlation ID.
 * 
 * @param customHeaders - Additional headers to include
 * @param bulkRequestId - Optional bulk request ID for tracking
 * @returns Complete headers object
 */
export async function buildHeaders(
    customHeaders?: HeadersInit,
    bulkRequestId?: string
): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };

    // Merge custom headers
    if (customHeaders) {
        if (customHeaders instanceof Headers) {
            customHeaders.forEach((value, key) => {
                headers[key] = value;
            });
        } else if (Array.isArray(customHeaders)) {
            customHeaders.forEach(([key, value]) => {
                headers[key] = value;
            });
        } else {
            Object.assign(headers, customHeaders);
        }
    }

    // Add correlation ID for request tracing
    if (!headers['X-Correlation-Id']) {
        headers['X-Correlation-Id'] = generateCorrelationId();
    }

    // Add bulk request ID if provided
    if (bulkRequestId) {
        headers['X-Bulk-Request-Id'] = bulkRequestId;
    }

    // Auth token injection (integrated with AuthContext)
    const token = await getAuthToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // TODO(ST1.3.1): Tenant context header
    const tenantId = getCurrentTenantId();
    if (tenantId) {
        headers['X-Tenant-Id'] = tenantId;
    }

    return headers;
}
