/**
 * Live Region Announcer
 * 
 * Provides utilities to announce messages to screen readers using ARIA live regions.
 * This is useful for dynamic content updates that should be communicated to assistive technologies.
 */

type AnnouncementPriority = 'polite' | 'assertive'

let liveRegion: HTMLDivElement | null = null

/**
 * Initialize the live region container if it doesn't exist
 */
function ensureLiveRegion(): HTMLDivElement {
    if (liveRegion && document.body.contains(liveRegion)) {
        return liveRegion
    }

    // Create a visually hidden live region
    liveRegion = document.createElement('div')
    liveRegion.setAttribute('role', 'status')
    liveRegion.setAttribute('aria-live', 'polite')
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'

    // Position it off-screen but still accessible to screen readers
    Object.assign(liveRegion.style, {
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
    })

    document.body.appendChild(liveRegion)
    return liveRegion
}

/**
 * Announce a message to screen readers
 * 
 * @param message - The message to announce
 * @param priority - Priority of the announcement ('polite' or 'assertive')
 * @param clearAfter - Time in ms after which to clear the message (default: 1000)
 * 
 * @example
 * ```typescript
 * announce('Item added to cart')
 * announce('Error: Please try again', 'assertive')
 * ```
 */
export function announce(
    message: string,
    priority: AnnouncementPriority = 'polite',
    clearAfter = 1000
): void {
    const region = ensureLiveRegion()
    region.setAttribute('aria-live', priority)
    region.textContent = message

    // Clear the message after a delay to allow for subsequent announcements
    if (clearAfter > 0) {
        setTimeout(() => {
            if (region.textContent === message) {
                region.textContent = ''
            }
        }, clearAfter)
    }
}

/**
 * Announce an error message with assertive priority
 * 
 * @param message - The error message to announce
 */
export function announceError(message: string): void {
    announce(message, 'assertive', 2000)
}

/**
 * Announce a success message with polite priority
 * 
 * @param message - The success message to announce
 */
export function announceSuccess(message: string): void {
    announce(message, 'polite', 1500)
}
