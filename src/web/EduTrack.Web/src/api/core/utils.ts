/**
 * Utility functions for the API client.
 * 
 * @module api/utils
 */

import { apiConfig } from '@/config';

/**
 * Generates a unique correlation ID for request tracing.
 * Uses a simple timestamp + random number approach.
 * 
 * @returns A unique correlation ID string
 */
export function generateCorrelationId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 9);
    return `${timestamp}-${randomPart}`;
}

/**
 * Sleep utility for retry delays.
 * 
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the delay
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Builds the complete request URL by prepending the base URL if needed.
 * 
 * @param endpoint - API endpoint (relative or absolute URL)
 * @returns Complete URL
 */
export function buildUrl(endpoint: string): string {
    // If it's already a full URL, return as-is
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
        return endpoint;
    }

    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Remove trailing slash from base URL if present
    const baseUrl = apiConfig.baseUrl.replace(/\/$/, '');

    return `${baseUrl}${normalizedEndpoint}`;
}
