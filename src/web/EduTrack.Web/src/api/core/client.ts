/**
 * Central HTTP client for all API communication.
 * 
 * Features:
 * - Automatic retry with exponential backoff on network/5xx errors
 * - Configurable timeout using AbortController
 * - Auth token injection (ready for M1.1.3)
 * - Tenant context headers (ready for M1.3.1)
 * - Typed responses with generics
 * - Request correlation IDs for tracing
 * 
 * @module api/client
 */

import { apiConfig } from '@/config';
import { buildHeaders } from '../config/headers';
import { handleResponse } from './response';
import { fetchWithRetry } from './retry';
import { buildUrl } from './utils';

/**
 * Extended request options for API calls.
 */
export interface RequestOptions extends RequestInit {
  /** Request timeout in milliseconds. Defaults to apiConfig.timeouts.standard */
  timeout?: number;
  /** Enable automatic retry on failure. Defaults to true */
  retry?: boolean;
  /** Maximum number of retry attempts. Defaults to apiConfig.retry.maxRetries */
  retryCount?: number;
  /** Initial delay between retries in ms. Defaults to apiConfig.retry.initialDelayMs */
  retryDelay?: number;
  /** Optional bulk request ID for tracking related operations */
  bulkRequestId?: string;
}

/**
 * Executes a fetch request with timeout support.
 * Uses AbortController to cancel the request if it exceeds the timeout.
 * 
 * @param url - Request URL
 * @param options - Request options including timeout
 * @returns Promise resolving to the Response object
 * @throws Error if the request times out
 */
async function fetchWithTimeout(
  url: string,
  options: RequestOptions
): Promise<Response> {
  const timeout = options.timeout ?? apiConfig.timeouts.standard;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetchWithRetry(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Central API client with typed HTTP methods.
 */
export const apiClient = {
  /**
   * Performs a GET request.
   * 
   * @template T - Expected response type
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise resolving to typed response data
   * 
   * @example
   * ```typescript
   * const departments = await apiClient.get<Department[]>('/departments');
   * ```
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = buildUrl(endpoint);
    const headers = await buildHeaders(options.headers, options.bulkRequestId);

    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'GET',
      headers,
    });

    return handleResponse<T>(response);
  },

  /**
   * Performs a POST request.
   * 
   * @template T - Expected response type
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise resolving to typed response data
   * 
   * @example
   * ```typescript
   * const created = await apiClient.post<Department>('/departments', {
   *   name: 'Mathematics',
   *   code: 'MATH'
   * });
   * ```
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = buildUrl(endpoint);
    const headers = await buildHeaders(options.headers, options.bulkRequestId);

    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  /**
   * Performs a PUT request for full resource updates.
   * 
   * @template T - Expected response type
   * @param endpoint - API endpoint
   * @param data - Request body data
   * @param options - Request options
   * @returns Promise resolving to typed response data
   * 
   * @example
   * ```typescript
   * const updated = await apiClient.put<Department>('/departments/123', {
   *   id: '123',
   *   name: 'Mathematics',
   *   code: 'MATH',
   *   rowVersion: 'abc123'
   * });
   * ```
   */
  async put<T>(
    endpoint: string,
    data: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = buildUrl(endpoint);
    const headers = await buildHeaders(options.headers, options.bulkRequestId);

    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
  },

  /**
   * Performs a PATCH request for partial resource updates.
   * 
   * @template T - Expected response type
   * @param endpoint - API endpoint
   * @param data - Partial data to update
   * @param options - Request options
   * @returns Promise resolving to typed response data
   * 
   * @example
   * ```typescript
   * const updated = await apiClient.patch<Department>('/departments/123', {
   *   name: 'Advanced Mathematics'
   * });
   * ```
   */
  async patch<T>(
    endpoint: string,
    data: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = buildUrl(endpoint);
    const headers = await buildHeaders(options.headers, options.bulkRequestId);

    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    return handleResponse<T>(response);
  },

  /**
   * Performs a DELETE request.
   * 
   * @template T - Expected response type (usually void or confirmation)
   * @param endpoint - API endpoint
   * @param options - Request options
   * @returns Promise resolving to typed response data
   * 
   * @example
   * ```typescript
   * await apiClient.delete('/departments/123');
   * ```
   */
  async delete<T = void>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = buildUrl(endpoint);
    const headers = await buildHeaders(options.headers, options.bulkRequestId);

    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'DELETE',
      headers,
    });

    return handleResponse<T>(response);
  },
};
