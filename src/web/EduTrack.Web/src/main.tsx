import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import { App } from './app'
import { initializeAxe } from './lib/accessibility/axe-init'
import { initializeMsal } from './lib/auth/config/msalInstance'

// Initialize accessibility testing in development mode
if (import.meta.env.DEV) {
  initializeAxe()
}

// Initialize MSAL before rendering
initializeMsal().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
