/**
 * Accessibility utilities and hooks
 * 
 * This module provides tools to help build accessible React applications:
 * - Live region announcements for dynamic content
 * - Focus management for keyboard navigation
 * - React hooks for common accessibility patterns
 */

export { announce, announceError, announceSuccess } from './announcer'
export {
    getFocusableElements,
    getFirstFocusableElement,
    getLastFocusableElement,
    trapFocus,
    saveFocus,
    focusFirstError,
} from './focus-management'
export {
    useFocusTrap,
    useRestoreFocus,
    usePageTitle,
    useAnnounceOnMount,
    useEscapeKey,
} from './hooks'
