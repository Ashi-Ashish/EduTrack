import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from '@/lib/auth/config/msalInstance'
import { AuthProvider } from '@/lib/auth/context/AuthContext'
import { AppRouter } from '@/app/router'

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </MsalProvider>
  )
}

export default App
