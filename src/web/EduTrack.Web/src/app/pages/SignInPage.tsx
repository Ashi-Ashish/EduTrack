import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth/hooks/useAuth'
import { SignInButton } from '@/lib/auth/components/SignInButton'

export function SignInPage() {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Redirect to return URL after successful sign-in
    useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as any)?.from?.pathname || '/'
            navigate(from, { replace: true })
        }
    }, [isAuthenticated, navigate, location])

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-md max-w-md w-full mx-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                        Welcome to EduTrack
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Sign in to access your dashboard
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-center">
                        <SignInButton />
                    </div>

                    <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                        Sign in with your Microsoft account to continue
                    </p>
                </div>
            </div>
        </div>
    )
}
