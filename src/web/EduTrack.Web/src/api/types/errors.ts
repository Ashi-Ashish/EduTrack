/**
 * API error types and error handling utilities.
 * 
 * @module api/errors
 */

/**
 * Validation error for a specific field.
 * Returned in 400 Bad Request responses.
 * 
 * @example
 * ```typescript
 * const error: ValidationError = {
 *   field: 'email',
 *   message: 'Email address is required'
 * };
 * ```
 */
export interface ValidationError {
    /** Field name that failed validation */
    readonly field: string;
    /** Human-readable error message */
    readonly message: string;
}

/**
 * Custom API error class that extends the standard Error.
 * Provides structured error information from API responses.
 * 
 * @example
 * ```typescript
 * try {
 *   const data = await apiClient.get('/departments/invalid-id');
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error(`API failed with status ${error.status}`);
 *     if (error.errors) {
 *       error.errors.forEach(e => console.error(`${e.field}: ${e.message}`));
 *     }
 *   }
 * }
 * ```
 */
export class ApiError extends Error {
    /** HTTP status code (e.g., 404, 500) */
    readonly status: number;
    /** HTTP status text (e.g., "Not Found", "Internal Server Error") */
    readonly statusText: string;
    /** Array of validation errors for 400 responses */
    readonly errors?: readonly ValidationError[];
    /** Timestamp when the error occurred */
    readonly timestamp: Date;
    /** Original response body */
    readonly responseBody?: string;

    /**
     * Creates a new ApiError from a Response object.
     * 
     * @param response - Fetch Response object
     * @param responseBody - Response body text (already read)
     * 
     * @example
     * ```typescript
     * const response = await fetch('/api/endpoint');
     * if (!response.ok) {
     *   const body = await response.text();
     *   throw new ApiError(response, body);
     * }
     * ```
     */
    constructor(response: Response, responseBody?: string) {
        // Parse response body to extract message and validation errors
        let message = `API Error: ${response.status} ${response.statusText}`;
        let validationErrors: ValidationError[] | undefined;

        if (responseBody) {
            try {
                const parsed: unknown = JSON.parse(responseBody);

                if (parsed && typeof parsed === 'object') {
                    const parsedObj = parsed as Record<string, unknown>;

                    // Extract message from various possible formats
                    if (typeof parsedObj.message === 'string') {
                        message = parsedObj.message;
                    } else if (typeof parsedObj.error === 'string') {
                        message = parsedObj.error;
                    } else if (typeof parsedObj.title === 'string') {
                        message = parsedObj.title;
                    }

                    // Extract validation errors (common formats from ASP.NET Core)
                    if (parsedObj.errors) {
                        if (Array.isArray(parsedObj.errors)) {
                            // Array format: [{ field: "name", message: "Required" }]
                            validationErrors = parsedObj.errors
                                .filter((e): e is Record<string, unknown> =>
                                    typeof e === 'object' && e !== null
                                )
                                .map(e => ({
                                    field: String(e.field ?? 'unknown'),
                                    message: String(e.message ?? 'Validation failed'),
                                }));
                        } else if (typeof parsedObj.errors === 'object' && parsedObj.errors !== null) {
                            // Object format: { "name": ["Required", "Too short"] }
                            validationErrors = Object.entries(parsedObj.errors).flatMap(
                                ([field, messages]) => {
                                    const msgArray = Array.isArray(messages) ? messages : [messages];
                                    return msgArray.map((msg) => ({
                                        field,
                                        message: String(msg),
                                    }));
                                }
                            );
                        }
                    }
                }
            } catch {
                // If JSON parsing fails, use raw body in message
                message = `${message}: ${responseBody}`;
            }
        }

        super(message);

        this.name = 'ApiError';
        this.status = response.status;
        this.statusText = response.statusText;
        this.errors = validationErrors ? Object.freeze(validationErrors) : undefined;
        this.timestamp = new Date();
        this.responseBody = responseBody;

        // Maintains proper stack trace for where error was thrown (V8 only)
        if ('captureStackTrace' in Error) {
            (Error as { captureStackTrace(target: object, constructor: Function): void }).captureStackTrace(this, ApiError);
        }
    }

    /**
     * Returns a formatted string representation of the error.
     * Includes validation errors if present.
     * 
     * @returns Formatted error string
     */
    override toString(): string {
        let result = `${this.name}: ${this.message} (${this.status})`;

        if (this.errors && this.errors.length > 0) {
            result += '\nValidation Errors:';
            for (const error of this.errors) {
                result += `\n  - ${error.field}: ${error.message}`;
            }
        }

        return result;
    }

    /**
     * Returns a plain object representation for logging/serialization.
     * Useful for structured logging systems.
     * 
     * @returns Plain object with error details
     * 
     * @example
     * ```typescript
     * catch (error) {
     *   if (error instanceof ApiError) {
     *     logger.error('API request failed', error.toJSON());
     *   }
     * }
     * ```
     */
    toJSON(): Record<string, unknown> {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            statusText: this.statusText,
            errors: this.errors,
            timestamp: this.timestamp.toISOString(),
        };
    }

    /**
     * Type guard to check if error is a validation error (400 Bad Request).
     * 
     * @returns True if the error is a validation error with field-specific issues
     * 
     * @example
     * ```typescript
     * catch (error) {
     *   if (error instanceof ApiError && error.isValidationError()) {
     *     // Show field-specific errors in form
     *     error.errors?.forEach(e => showFieldError(e.field, e.message));
     *   }
     * }
     * ```
     */
    isValidationError(): this is ApiError & { errors: readonly ValidationError[] } {
        return this.status === 400 && !!this.errors && this.errors.length > 0;
    }

    /**
     * Type guard to check if error is a not found error (404).
     * 
     * @returns True if the error status is 404
     * 
     * @example
     * ```typescript
     * catch (error) {
     *   if (error instanceof ApiError && error.isNotFoundError()) {
     *     navigate('/404');
     *   }
     * }
     * ```
     */
    isNotFoundError(): boolean {
        return this.status === 404;
    }

    /**
     * Type guard to check if error is a server error (5xx).
     * 
     * @returns True if the error status is in the 500-599 range
     * 
     * @example
     * ```typescript
     * catch (error) {
     *   if (error instanceof ApiError && error.isServerError()) {
     *     showToast('Server error. Please try again later.', 'error');
     *   }
     * }
     * ```
     */
    isServerError(): boolean {
        return this.status >= 500 && this.status < 600;
    }

    /**
     * Type guard to check if error is an authentication error (401).
     * 
     * @returns True if the error status is 401
     * 
     * @example
     * ```typescript
     * catch (error) {
     *   if (error instanceof ApiError && error.isAuthenticationError()) {
     *     redirectToLogin();
     *   }
     * }
     * ```
     */
    isAuthenticationError(): boolean {
        return this.status === 401;
    }

    /**
     * Type guard to check if error is an authorization error (403).
     * 
     * @returns True if the error status is 403
     * 
     * @example
     * ```typescript
     * catch (error) {
     *   if (error instanceof ApiError && error.isAuthorizationError()) {
     *     showToast('You do not have permission to perform this action.', 'error');
     *   }
     * }
     * ```
     */
    isAuthorizationError(): boolean {
        return this.status === 403;
    }
}
