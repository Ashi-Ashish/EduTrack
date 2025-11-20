import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./msalConfig";

/**
 * Singleton MSAL instance
 * SECURITY: Manages tokens securely, handles PKCE automatically
 */
export const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Initialize MSAL - call this in main.tsx before rendering
 */
export async function initializeMsal(): Promise<void> {
    await msalInstance.initialize();

    // Handle redirect promise (OAuth callback)
    await msalInstance.handleRedirectPromise();
}
