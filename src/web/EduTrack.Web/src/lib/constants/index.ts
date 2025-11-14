/**
 * Application-wide constants.
 * 
 * @module lib/constants
 */

/**
 * Common HTTP status codes.
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Common date/time formats.
 */
export const DATE_FORMATS = {
    ISO_DATE: 'YYYY-MM-DD',
    ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ssZ',
    DISPLAY_DATE: 'MMM D, YYYY',
    DISPLAY_DATETIME: 'MMM D, YYYY h:mm A',
    TIME_12H: 'h:mm A',
    TIME_24H: 'HH:mm',
} as const;

/**
 * Validation regex patterns.
 */
export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_US: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
    ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
} as const;

/**
 * Local storage keys used throughout the application.
 */
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    TENANT_ID: 'tenant_id',
    THEME: 'edutrack-theme',
    USER_PREFERENCES: 'user_preferences',
} as const;

/**
 * Common page sizes for pagination.
 */
export const PAGE_SIZES = [10, 25, 50, 100] as const;

/**
 * Default pagination settings.
 */
export const DEFAULT_PAGE_SIZE = 25;
export const DEFAULT_PAGE_NUMBER = 1;
