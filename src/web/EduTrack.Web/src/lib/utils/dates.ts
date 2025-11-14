/**
 * Date and time formatting utilities.
 * 
 * @module lib/utils/dates
 */

/**
 * Formats a date to a localized string.
 * 
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * formatDate(new Date('2025-11-13')) // 'Nov 13, 2025'
 * formatDate(new Date('2025-11-13'), 'en-US', { dateStyle: 'full' }) // 'Wednesday, November 13, 2025'
 * ```
 */
export function formatDate(
    date: Date | string | number,
    locale = 'en-US',
    options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Formats a date to ISO string (YYYY-MM-DD).
 * 
 * @param date - Date to format
 * @returns ISO date string
 * 
 * @example
 * ```typescript
 * toISODate(new Date('2025-11-13T10:30:00')) // '2025-11-13'
 * ```
 */
export function toISODate(date: Date | string | number): string {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return dateObj.toISOString().split('T')[0];
}

/**
 * Calculates relative time string (e.g., "2 hours ago", "in 3 days").
 * 
 * @param date - Date to compare
 * @param baseDate - Base date for comparison (default: now)
 * @returns Relative time string
 * 
 * @example
 * ```typescript
 * const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
 * getRelativeTime(twoHoursAgo) // '2 hours ago'
 * ```
 */
export function getRelativeTime(date: Date | string | number, baseDate: Date = new Date()): string {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const diffMs = dateObj.getTime() - baseDate.getTime();
    const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);
    const isPast = diffMs < 0;

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffSeconds / interval.seconds);
        if (count >= 1) {
            const plural = count > 1 ? 's' : '';
            return isPast
                ? `${count} ${interval.label}${plural} ago`
                : `in ${count} ${interval.label}${plural}`;
        }
    }

    return 'just now';
}

/**
 * Checks if a date is today.
 * 
 * @param date - Date to check
 * @returns True if date is today
 * 
 * @example
 * ```typescript
 * isToday(new Date()) // true
 * isToday(new Date('2024-01-01')) // false
 * ```
 */
export function isToday(date: Date | string | number): boolean {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const today = new Date();
    return (
        dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear()
    );
}
