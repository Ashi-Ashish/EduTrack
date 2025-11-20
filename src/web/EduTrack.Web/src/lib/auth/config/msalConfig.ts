import { LogLevel } from "@azure/msal-browser";
import type { Configuration } from "@azure/msal-browser";

/**
 * Configuration for MSAL authentication
 * SECURITY: PKCE enabled automatically, tokens stored in memory
 */
export const msalConfig: Configuration = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "",
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || "common"
            }`,
        redirectUri:
            import.meta.env.VITE_AZURE_REDIRECT_URI || "http://localhost:5173",
        postLogoutRedirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage", // More secure than localStorage
        storeAuthStateInCookie: false, // Set true for IE11/Edge legacy
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        break;
                    case LogLevel.Warning:
                        console.warn(message);
                        break;
                    case LogLevel.Info:
                        console.info(message);
                        break;
                }
            },
            logLevel: LogLevel.Warning,
        },
    },
};

/**
 * Scopes to request during login
 * IMPORTANT: Must match API permissions in Azure Portal
 */
export const loginRequest = {
    scopes: ["User.Read"], // Basic profile scope
};

/**
 * Scopes for API access
 * TODO: Update with your API scope after backend configuration
 */
export const apiRequest = {
    scopes: [`api://${import.meta.env.VITE_AZURE_CLIENT_ID}/access_as_user`],
};
