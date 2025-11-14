/**
 * Public entry-point for the Fetch-based HTTP utilities.
 *
 * Exposed capabilities:
 * - Fetch-powered `apiClient` with retries, timeouts, and auth/tenant hooks
 * - Structured error helpers (`ApiError`, pagination, validation metadata)
 * - Header + URL builders for correlation IDs, tracing, and bulk operations
 *
 * Environment configuration:
 * - Base URL is derived from `VITE_API_BASE_URL` (see `src/config/api.config.ts`)
 * - Timeout and retry defaults are centralized in `apiConfig`
 *
 * @example
 * ```ts
 * import { apiClient } from '@/api';
 *
 * const departments = await apiClient.get<Department[]>('/departments');
 * ```
 *
 * @module api
 */

// Core client surface
export { apiClient } from './core/client';
export type { RequestOptions } from './core/client';

// Error + type helpers
export { ApiError } from './types/errors';
export type { ValidationError } from './types/errors';
export type { PaginatedResponse, ApiResponse } from './types/responses';

// Utilities (advanced scenarios)
export { generateCorrelationId, buildUrl } from './core/utils';
export { buildHeaders } from './config/headers';
export { getAuthToken, getCurrentTenantId } from './config/auth';

