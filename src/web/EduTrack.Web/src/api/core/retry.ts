/**
 * Retry logic with exponential backoff for API requests.
 * 
 * @module api/retry
 */

import { apiConfig } from '@/config';
import { ApiError } from '../types/errors';
import { sleep } from './utils';

/**
 * Extended request options for retry configuration.
 */
export interface RetryOptions extends RequestInit {
    /** Enable automatic retry on failure. Defaults to true */
    retry?: boolean;
    /** Maximum number of retry attempts. Defaults to apiConfig.retry.maxRetries */
    retryCount?: number;
    /** Initial delay between retries in ms. Defaults to apiConfig.retry.initialDelayMs */
    retryDelay?: number;
}

/**
 * Determines if an error is retryable.
 * Network errors and 5xx server errors should be retried.
 * 4xx client errors should not be retried.
 * 
 * @param error - Error object or HTTP status code
 * @returns True if the error should trigger a retry
 */
function isRetryableError(error: unknown): boolean {
    // Network errors (TypeError for fetch failures)
    if (error instanceof TypeError) {
        return true;
    }

    // ApiError with 5xx status - use type guard
    if (error instanceof ApiError && typeof error.status === 'number') {
        return error.status >= 500 && error.status < 600;
    }

    // Default: don't retry
    return false;
}

/**
 * Executes a fetch request with automatic retry and exponential backoff.
 * 
 * Retry logic:
 * - Retries on network errors and 5xx server errors
 * - Skips retry on 4xx client errors (auth, validation, not found, etc.)
 * - Uses exponential backoff: delay = baseDelay × 2^attemptNumber
 * - Adds jitter (randomization) to prevent thundering herd
 * 
 * @param url - Request URL
 * @param options - Request options including retry configuration
 * @returns Promise resolving to the Response object
 * @throws ApiError if all retry attempts fail
 */
export async function fetchWithRetry(
    url: string,
    options: RetryOptions
): Promise<Response> {
    const maxRetries = options.retryCount ?? apiConfig.retry.maxRetries;
    const baseDelay = options.retryDelay ?? apiConfig.retry.initialDelayMs;
    const shouldRetry = options.retry !== false;

    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);

            // If response is OK or it's a 4xx error (don't retry), return it
            if (response.ok || (response.status >= 400 && response.status < 500)) {
                return response;
            }

            // 5xx error - might retry
            lastError = new ApiError(response, await response.text());

            if (!shouldRetry || attempt === maxRetries) {
                throw lastError;
            }
        } catch (error) {
            lastError = error;

            // Don't retry if it's the last attempt or retry is disabled
            if (!shouldRetry || attempt === maxRetries) {
                throw error;
            }

            // Don't retry if it's not a retryable error
            if (!isRetryableError(error)) {
                throw error;
            }
        }

        // Calculate delay with exponential backoff and jitter
        const exponentialDelay = baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 0.3 * exponentialDelay; // ±30% jitter
        const delayMs = exponentialDelay + jitter;

        if (import.meta.env.DEV) {
            console.debug(
                `[API Client] Retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(delayMs)}ms`
            );
        }

        await sleep(delayMs);
    }

    // This should never be reached, but TypeScript needs it
    throw lastError;
}
