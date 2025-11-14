import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import { App } from './app'
import { initializeAxe } from './lib/accessibility/axe-init'

// Initialize accessibility testing in development mode
if (import.meta.env.DEV) {
  initializeAxe()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
