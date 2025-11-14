/**
 * React hooks for accessibility features
 */

import { useEffect, useRef } from 'react'
import { trapFocus, saveFocus } from './focus-management'

/**
 * Hook to trap focus within a component (useful for modals/dialogs)
 * 
 * @param isActive - Whether the focus trap should be active
 * 
 * @example
 * ```tsx
 * function Modal({ isOpen }: { isOpen: boolean }) {
 *   const ref = useFocusTrap<HTMLDivElement>(isOpen)
 *   
 *   if (!isOpen) return null
 *   return <div ref={ref}>Modal content</div>
 * }
 * ```
 */
export function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
    const ref = useRef<T>(null)

    useEffect(() => {
        if (!isActive || !ref.current) return

        const cleanup = trapFocus(ref.current)
        return cleanup
    }, [isActive])

    return ref
}

/**
 * Hook to save and restore focus when a component mounts/unmounts
 * 
 * @example
 * ```tsx
 * function Modal() {
 *   useRestoreFocus()
 *   return <div>Modal content</div>
 * }
 * ```
 */
export function useRestoreFocus(): void {
    useEffect(() => {
        const restore = saveFocus()
        return restore
    }, [])
}

/**
 * Hook to set document title and announce page changes to screen readers
 * 
 * @param title - The page title
 * @param announce - Whether to announce the title change (default: true)
 * 
 * @example
 * ```tsx
 * function HomePage() {
 *   usePageTitle('Home - EduTrack')
 *   return <div>Home content</div>
 * }
 * ```
 */
export function usePageTitle(title: string, announce = true): void {
    useEffect(() => {
        const previousTitle = document.title
        document.title = title

        // Announce title change to screen readers
        if (announce) {
            // Extract the page name (before the dash)
            const pageName = title.split('-')[0].trim()

            // Use a small delay to ensure the announcement happens after navigation
            const timeoutId = setTimeout(() => {
                const announcer = document.getElementById('page-announcer')
                if (announcer) {
                    announcer.textContent = `Navigated to ${pageName}`
                }
            }, 100)

            return () => clearTimeout(timeoutId)
        }

        return () => {
            document.title = previousTitle
        }
    }, [title, announce])
}

/**
 * Hook to manage component mount announcements
 * 
 * @param message - Message to announce when component mounts
 * @param delay - Delay before announcing (default: 100ms)
 * 
 * @example
 * ```tsx
 * function SearchResults({ count }: { count: number }) {
 *   useAnnounceOnMount(`Found ${count} results`)
 *   return <div>Results...</div>
 * }
 * ```
 */
export function useAnnounceOnMount(message: string, delay = 100): void {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const announcer = document.getElementById('page-announcer')
            if (announcer) {
                announcer.textContent = message
            }
        }, delay)

        return () => clearTimeout(timeoutId)
    }, [message, delay])
}

/**
 * Hook to handle escape key press (useful for closing modals)
 * 
 * @param handler - Function to call when escape is pressed
 * @param isActive - Whether the handler should be active
 * 
 * @example
 * ```tsx
 * function Modal({ onClose }: { onClose: () => void }) {
 *   useEscapeKey(onClose, true)
 *   return <div>Modal content</div>
 * }
 * ```
 */
export function useEscapeKey(handler: () => void, isActive = true): void {
    useEffect(() => {
        if (!isActive) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handler()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handler, isActive])
}
