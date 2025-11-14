/**
 * Axe-core integration for accessibility testing in development mode
 * 
 * This file is only loaded in development and provides real-time accessibility
 * violation detection in the browser console.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'

/**
 * Initialize axe-core for accessibility testing in development
 * Only runs in development mode to avoid performance impact in production
 */
export async function initializeAxe() {
    if (import.meta.env.DEV) {
        try {
            const axe = await import('@axe-core/react')

            // Initialize axe with React and ReactDOM
            // The third parameter is delay in milliseconds (1000ms = 1 second)
            await axe.default(React, ReactDOM, 1000)

            console.info(
                '%c♿ Accessibility testing enabled',
                'color: #10b981; font-weight: bold; font-size: 12px;',
                '\naxe-core is monitoring for accessibility violations. Check the console for issues.'
            )
        } catch (error) {
            console.warn('Failed to initialize axe-core for accessibility testing:', error)
        }
    }
}
