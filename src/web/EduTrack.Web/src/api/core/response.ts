/**
 * Response handling utilities for API requests.
 * 
 * @module api/response
 */

import { ApiError } from '../types/errors';

/**
 * Processes the API response, handling errors and parsing JSON.
 * 
 * @param response - Fetch Response object
 * @returns Parsed response data
 * @throws ApiError for non-OK responses
 */
export async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorBody = await response.text();
        throw new ApiError(response, errorBody);
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
        return undefined as T;
    }

    // Parse JSON response
    try {
        return await response.json() as T;
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('[API Client] Failed to parse JSON response:', error);
        }
        throw new Error('Invalid JSON response from server');
    }
}
