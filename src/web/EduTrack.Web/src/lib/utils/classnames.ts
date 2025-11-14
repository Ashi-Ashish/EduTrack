/**
 * Class name utility for conditional CSS classes.
 * Similar to the popular `clsx` or `classnames` libraries.
 * 
 * @module lib/utils/classnames
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, boolean>;

/**
 * Combines class names conditionally.
 * 
 * @param classes - Class names or objects with boolean values
 * @returns Combined class name string
 * 
 * @example
 * ```typescript
 * cn('btn', 'btn-primary') // 'btn btn-primary'
 * cn('btn', { 'btn-active': true, 'btn-disabled': false }) // 'btn btn-active'
 * cn('btn', isActive && 'btn-active') // 'btn btn-active' (if isActive is true)
 * cn(['btn', 'btn-primary']) // 'btn btn-primary'
 * ```
 */
export function cn(...classes: ClassValue[]): string {
    const result: string[] = [];

    for (const cls of classes) {
        if (!cls) continue;

        if (typeof cls === 'string' || typeof cls === 'number') {
            result.push(String(cls));
        } else if (Array.isArray(cls)) {
            const nested = cn(...cls);
            if (nested) result.push(nested);
        } else if (typeof cls === 'object') {
            for (const [key, value] of Object.entries(cls)) {
                if (value) result.push(key);
            }
        }
    }

    return result.join(' ');
}
