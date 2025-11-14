/**
 * VisuallyHidden Component
 * 
 * Hides content visually but keeps it accessible to screen readers.
 * Useful for providing additional context to assistive technologies.
 */

import type { ReactNode } from 'react'

type VisuallyHiddenProps = {
    children: ReactNode
    /**
     * The element type to render
     * @default 'span'
     */
    as?: 'span' | 'div' | 'p'
}

export function VisuallyHidden({ children, as: Component = 'span' }: VisuallyHiddenProps) {
    return <Component className="sr-only">{children}</Component>
}
