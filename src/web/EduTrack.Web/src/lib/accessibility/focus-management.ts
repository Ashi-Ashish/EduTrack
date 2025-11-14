/**
 * Focus Management Utilities
 * 
 * Provides functions for managing keyboard focus, particularly useful for
 * modals, dialogs, and other interactive components.
 */

/**
 * Query selector for all focusable elements
 */
const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
].join(', ')

/**
 * Get all focusable elements within a container
 * 
 * @param container - The container element to search within
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
    )
}

/**
 * Get the first focusable element within a container
 * 
 * @param container - The container element to search within
 * @returns The first focusable element or null
 */
export function getFirstFocusableElement(container: HTMLElement): HTMLElement | null {
    const focusable = getFocusableElements(container)
    return focusable[0] || null
}

/**
 * Get the last focusable element within a container
 * 
 * @param container - The container element to search within
 * @returns The last focusable element or null
 */
export function getLastFocusableElement(container: HTMLElement): HTMLElement | null {
    const focusable = getFocusableElements(container)
    return focusable[focusable.length - 1] || null
}

/**
 * Trap focus within a container (useful for modals and dialogs)
 * 
 * @param container - The container element to trap focus within
 * @returns Cleanup function to remove the trap
 * 
 * @example
 * ```typescript
 * const cleanup = trapFocus(dialogElement)
 * // Later, when closing the dialog:
 * cleanup()
 * ```
 */
export function trapFocus(container: HTMLElement): () => void {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return

        const focusable = getFocusableElements(container)
        if (focusable.length === 0) return

        const firstElement = focusable[0]
        const lastElement = focusable[focusable.length - 1]
        const activeElement = document.activeElement as HTMLElement

        // Shift + Tab
        if (event.shiftKey) {
            if (activeElement === firstElement) {
                event.preventDefault()
                lastElement.focus()
            }
        }
        // Tab
        else {
            if (activeElement === lastElement) {
                event.preventDefault()
                firstElement.focus()
            }
        }
    }

    container.addEventListener('keydown', handleKeyDown)

    // Focus the first focusable element when trap is activated
    const firstFocusable = getFirstFocusableElement(container)
    if (firstFocusable) {
        firstFocusable.focus()
    }

    return () => {
        container.removeEventListener('keydown', handleKeyDown)
    }
}

/**
 * Store and restore focus for components that temporarily take focus
 * 
 * @example
 * ```typescript
 * const restoreFocus = saveFocus()
 * // ... open modal or perform action ...
 * restoreFocus()
 * ```
 */
export function saveFocus(): () => void {
    const previouslyFocused = document.activeElement as HTMLElement | null

    return () => {
        if (previouslyFocused && previouslyFocused.focus) {
            previouslyFocused.focus()
        }
    }
}

/**
 * Focus the first element with an error (useful for form validation)
 * 
 * @param container - The container to search for error elements
 * @param errorSelector - CSS selector for error elements (default: '[aria-invalid="true"]')
 */
export function focusFirstError(
    container: HTMLElement = document.body,
    errorSelector = '[aria-invalid="true"]'
): void {
    const firstError = container.querySelector<HTMLElement>(errorSelector)
    if (firstError) {
        firstError.focus()
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
}
