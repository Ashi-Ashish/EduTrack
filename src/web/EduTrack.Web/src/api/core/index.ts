/**
 * Core API client functionality.
 * Includes the main HTTP client, retry logic, response handling, and utilities.
 * 
 * @module api/core
 */

export { apiClient } from './client';
export type { RequestOptions } from './client';
export { handleResponse } from './response';
export { fetchWithRetry } from './retry';
export type { RetryOptions } from './retry';
export { generateCorrelationId, buildUrl, sleep } from './utils';
