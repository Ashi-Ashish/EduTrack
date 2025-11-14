/**
 * Common utility functions for string manipulation, formatting, and validation.
 * 
 * @module lib/utils/strings
 */

/**
 * Capitalizes the first letter of a string.
 * 
 * @param str - The string to capitalize
 * @returns The capitalized string
 * 
 * @example
 * ```typescript
 * capitalize('hello') // 'Hello'
 * capitalize('WORLD') // 'WORLD'
 * ```
 */
export function capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates a string to a specified length and adds an ellipsis if needed.
 * 
 * @param str - The string to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns The truncated string
 * 
 * @example
 * ```typescript
 * truncate('Hello World', 8) // 'Hello...'
 * truncate('Short', 10) // 'Short'
 * truncate('Long text', 8, '…') // 'Long te…'
 * ```
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Converts a string to kebab-case.
 * 
 * @param str - The string to convert
 * @returns The kebab-cased string
 * 
 * @example
 * ```typescript
 * toKebabCase('HelloWorld') // 'hello-world'
 * toKebabCase('hello_world') // 'hello-world'
 * toKebabCase('hello world') // 'hello-world'
 * ```
 */
export function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

/**
 * Converts a string to camelCase.
 * 
 * @param str - The string to convert
 * @returns The camelCased string
 * 
 * @example
 * ```typescript
 * toCamelCase('hello-world') // 'helloWorld'
 * toCamelCase('hello_world') // 'helloWorld'
 * toCamelCase('Hello World') // 'helloWorld'
 * ```
 */
export function toCamelCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase());
}

/**
 * Checks if a string is empty or contains only whitespace.
 * 
 * @param str - The string to check
 * @returns True if the string is empty or whitespace-only
 * 
 * @example
 * ```typescript
 * isEmpty('') // true
 * isEmpty('   ') // true
 * isEmpty('hello') // false
 * ```
 */
export function isEmpty(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0;
}
