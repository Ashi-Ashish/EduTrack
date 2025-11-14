/**
 * Standard API response type definitions.
 * 
 * @module api/responses
 */

/**
 * Standard paginated response from list endpoints.
 * Used for collections that support server-side pagination.
 * 
 * @template T - Type of items in the collection
 * 
 * @example
 * ```typescript
 * interface Department {
 *   id: string;
 *   name: string;
 * }
 * 
 * const response: PaginatedResponse<Department> = {
 *   items: [{ id: '1', name: 'Math' }],
 *   totalCount: 50,
 *   pageNumber: 1,
 *   pageSize: 10,
 *   totalPages: 5,
 *   hasNextPage: true,
 *   hasPreviousPage: false
 * };
 * ```
 */
export interface PaginatedResponse<T> {
    /** Array of items for the current page */
    readonly items: readonly T[];
    /** Total number of items across all pages */
    readonly totalCount: number;
    /** Current page number (1-indexed) */
    readonly pageNumber: number;
    /** Number of items per page */
    readonly pageSize: number;
    /** Total number of pages */
    readonly totalPages: number;
    /** Whether there is a next page available */
    readonly hasNextPage: boolean;
    /** Whether there is a previous page available */
    readonly hasPreviousPage: boolean;
}

/**
 * Standard non-paginated response wrapper.
 * Used for single item responses or operations that return metadata.
 * 
 * @template T - Type of the data payload
 * 
 * @example
 * ```typescript
 * interface Department {
 *   id: string;
 *   name: string;
 * }
 * 
 * const response: ApiResponse<Department> = {
 *   data: { id: '1', name: 'Mathematics' },
 *   message: 'Department created successfully',
 *   success: true,
 *   timestamp: '2025-11-13T10:30:00Z'
 * };
 * ```
 */
export interface ApiResponse<T> {
    /** Response data payload */
    readonly data: T;
    /** Optional message from the server */
    readonly message?: string;
    /** Whether the operation was successful */
    readonly success: boolean;
    /** Timestamp of the response */
    readonly timestamp?: string;
}
