import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth/hooks/useAuth'

export function ForbiddenPage() {
    const { user } = useAuth()

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-md max-w-md w-full mx-4 text-center">
                <div className="mb-6">
                    <div className="text-6xl font-bold text-red-600 dark:text-red-500 mb-4">403</div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                        Access Denied
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        You don't have permission to access this page.
                    </p>
                </div>

                {user && user.roles.length > 0 && (
                    <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Your roles:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {user.roles.map((role) => (
                                <span
                                    key={role}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                >
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <Link
                        to="/"
                        className="inline-block w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Go to Home
                    </Link>
                    <Link
                        to="/sign-in"
                        className="inline-block w-full px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Sign In with Different Account
                    </Link>
                </div>
            </div>
        </div>
    )
}
