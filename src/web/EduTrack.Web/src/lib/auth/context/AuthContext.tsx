import { createContext, useContext, useState, useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import type { AuthContextValue, User } from "../types";
import { loginRequest, apiRequest } from "../config/msalConfig";
import { setTokenGetter } from "@/api/config/auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Extract user info from MSAL account
    useEffect(() => {
        if (isAuthenticated && accounts[0]) {
            const account = accounts[0];
            const user: User = {
                id: account.localAccountId,
                email: account.username,
                name: account.name || account.username,
                roles: (account.idTokenClaims?.roles as string[]) || [],
                tenantId: account.tenantId,
            };
            setUser(user);
            setIsLoading(false);
        } else {
            setUser(null);
            setIsLoading(false);
        }
    }, [isAuthenticated, accounts]);

    // Login with redirect
    const login = async () => {
        try {
            setError(null);
            await instance.loginRedirect(loginRequest);
        } catch (err) {
            setError("Login failed. Please try again.");
            console.error("Login error:", err);
        }
    };

    // Logout
    const logout = async () => {
        try {
            await instance.logoutRedirect();
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    // Acquire access token for API calls
    const acquireToken = async (): Promise<string | null> => {
        if (!accounts[0]) return null;

        try {
            // Try silent token acquisition first
            const response = await instance.acquireTokenSilent({
                ...apiRequest,
                account: accounts[0],
            });
            return response.accessToken;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                // Fallback to interactive method
                try {
                    const response = await instance.acquireTokenPopup(apiRequest);
                    return response.accessToken;
                } catch (err) {
                    console.error("Token acquisition failed:", err);
                    return null;
                }
            }
            return null;
        }
    };

    // Integrate with API client - set token getter on mount
    useEffect(() => {
        setTokenGetter(acquireToken);
    }, []);

    const value: AuthContextValue = {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        acquireToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
