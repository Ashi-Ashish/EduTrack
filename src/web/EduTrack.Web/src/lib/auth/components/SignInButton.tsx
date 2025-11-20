import { useAuth } from '../hooks/useAuth'

export function SignInButton() {
    const { login, isLoading } = useAuth()

    return (
        <button
            onClick={login}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Sign in with Microsoft"
        >
            {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
    )
}
