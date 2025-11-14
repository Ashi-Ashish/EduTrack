/**
 * SkipNavigation Component
 * 
 * Provides a "Skip to main content" link for keyboard users.
 * This improves accessibility by allowing users to bypass navigation and jump directly to main content.
 */

import './SkipNavigation.css'

type SkipNavigationProps = {
    /**
     * ID of the main content element to skip to
     * @default 'main-content'
     */
    targetId?: string
    /**
     * Text to display in the skip link
     * @default 'Skip to main content'
     */
    label?: string
}

export function SkipNavigation({ targetId = 'main-content', label = 'Skip to main content' }: SkipNavigationProps) {
    return (
        <a href={`#${targetId}`} className="skip-navigation">
            {label}
        </a>
    )
}
