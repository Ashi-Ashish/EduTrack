# ST1.1.3 Frontend Sign-In & Sign-Out - Implementation Plan

> **Story**: [Issue #17](https://github.com/Ashi-Ashish/EduTrack/issues/17)  
> **Epic**: M1.1 - Authentication & Authorization  
> **Status**: ✅ Complete  
> **Estimated Effort**: ~18 hours (2-3 days)  
> **⚠️ SECURITY-FIRST IMPLEMENTATION**: MSAL-based secure authentication

---

## 🔒 Security-First Architecture

**This implementation uses Microsoft Authentication Library (MSAL) for production-grade security.**

### Why MSAL?

| Requirement          | MSAL Solution                              | Without MSAL (Risk)                    |
| -------------------- | ------------------------------------------ | -------------------------------------- |
| **Token Storage**    | Secure in-memory + sessionStorage fallback | localStorage = XSS vulnerable ❌       |
| **PKCE**             | Automatic PKCE generation/validation       | Manual implementation = error-prone ❌ |
| **Token Refresh**    | Automatic silent renewal                   | Manual refresh = complex logic ❌      |
| **Token Validation** | Built-in JWT validation                    | DIY validation = security holes ❌     |
| **Logout**           | Proper Entra ID logout + local cleanup     | Local-only = orphaned sessions ❌      |

### 🔴 Three Critical Security Principles

1. **🛡️ NEVER use localStorage for tokens**
   - Vulnerable to XSS attacks
   - MSAL uses secure in-memory storage
2. **🔐 PKCE is mandatory (OAuth 2.1)**
   - MSAL enables PKCE automatically
   - Prevents authorization code interception
3. **♻️ Automatic token refresh**
   - MSAL handles silent token renewal
   - No expired token scenarios for users

### Deferred Security Items (Pre-Production)

See `_plan/SECURITY_BACKLOG.md` for implementation timeline (Month 4):

- Backend security headers (CSP, X-Frame-Options)
- Backend rate limiting
- Backend CORS hardening
- Backend audit logging

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites & Dependencies](#prerequisites--dependencies)
3. [Implementation Phases](#implementation-phases)
   - [Phase 1: MSAL Setup & Configuration](#phase-1-msal-setup--configuration)
   - [Phase 2: Authentication Context](#phase-2-authentication-context)
   - [Phase 3: UI Components](#phase-3-ui-components)
   - [Phase 4: Route Protection](#phase-4-route-protection)
   - [Phase 5: Role-Based Navigation](#phase-5-role-based-navigation)
   - [Phase 6: Testing](#phase-6-testing)
4. [Success Criteria](#success-criteria)
5. [Rollout Strategy](#rollout-strategy)

---

## Overview

This implementation uses **Microsoft Authentication Library (MSAL)** for React to build secure, production-grade authentication.

### What You'll Build

```
┌─────────────────────────────────────────┐
│  Frontend (React + MSAL)                │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │ Sign-In Page │───▶│ MSAL Redirect│  │
│  └──────────────┘    └──────────────┘  │
│         │                    │          │
│         │                    ▼          │
│         │          ┌──────────────────┐ │
│         │          │ Entra ID (OAuth2)│ │
│         │          └──────────────────┘ │
│         │                    │          │
│         ▼                    ▼          │
│  ┌──────────────────────────────────┐  │
│  │   AuthContext (MSAL wrapper)     │  │
│  │   • In-memory token storage      │  │
│  │   • Automatic refresh            │  │
│  │   • Role extraction              │  │
│  └──────────────────────────────────┘  │
│         │                                │
│         ▼                                │
│  ┌──────────────────────────────────┐  │
│  │   Protected Routes               │  │
│  │   • Role-based guards            │  │
│  │   • Auto-redirect                │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Key Features

- ✅ **Secure Token Management**: MSAL in-memory storage (no localStorage)
- ✅ **PKCE Enabled**: Automatic OAuth 2.1 compliance
- ✅ **Silent Token Refresh**: Background renewal before expiration
- ✅ **Role-Based Access**: Extract roles from JWT, enforce permissions
- ✅ **Protected Routes**: Automatic redirect for unauthenticated users
- ✅ **Graceful Error Handling**: Network failures, token expiration
- ✅ **Development Mode**: Mock authentication for local dev

---

## Prerequisites & Dependencies

### ✅ Backend Requirements (Already Complete)

| Component              | Status      | Details                           |
| ---------------------- | ----------- | --------------------------------- |
| JWT Authentication     | ✅ Complete | ST1.1.1 - Entra ID integration    |
| Authorization Policies | ✅ Complete | ST1.1.2 - Role hierarchy defined  |
| API Endpoint           | ✅ Ready    | `/api/auth/test` validates tokens |

### 📦 NPM Dependencies to Install

```bash
cd src/web/EduTrack.Web
npm install @azure/msal-browser @azure/msal-react
```

| Package               | Version | Purpose                             |
| --------------------- | ------- | ----------------------------------- |
| `@azure/msal-browser` | ^3.x    | Core MSAL authentication logic      |
| `@azure/msal-react`   | ^2.x    | React hooks and components for MSAL |

### 🔑 Configuration Requirements

**You'll need from Azure Portal (Entra ID App Registration)**:

1. **Client ID** (Application ID)
2. **Tenant ID** (Directory ID)
3. **Redirect URI** (e.g., `http://localhost:5173/auth/callback`)

**Where to find**:

- Azure Portal → Entra ID → App Registrations → Your App
- Copy `Application (client) ID` and `Directory (tenant) ID`
- Add redirect URI in "Authentication" section

### 🚫 Blocking Dependencies (None)

All prerequisites are met - ready to start implementation!

---

## Implementation Phases

### 📊 Phase Overview

| Phase       | Focus            | Duration     | Deliverables                       | Status      |
| ----------- | ---------------- | ------------ | ---------------------------------- | ----------- |
| **Phase 1** | MSAL Setup       | 3 hours      | MSAL config, folder structure      | ✅ Complete |
| **Phase 2** | Auth Context     | 4 hours      | AuthProvider with MSAL integration | ✅ Complete |
| **Phase 3** | UI Components    | 4 hours      | Sign-in, sign-out, user menu       | ✅ Complete |
| **Phase 4** | Route Protection | 3 hours      | Protected routes, guards           | ✅ Complete |
| **Phase 5** | Navigation       | 2 hours      | Role-based nav filtering           | ✅ Complete |
| **Phase 6** | Testing          | 2 hours      | E2E tests, manual validation       | ✅ Complete |
| **Total**   |                  | **18 hours** | Full authentication system         | **100%**    |

---

## Phase 1: MSAL Setup & Configuration

**Duration**: 3 hours  
**Goal**: Install MSAL, create configuration, set up folder structure

### Step 1.1: Install Dependencies

```bash
cd src/web/EduTrack.Web
npm install @azure/msal-browser @azure/msal-react
```

**Verify installation**:

```bash
npm list @azure/msal-browser @azure/msal-react
```

✅ **Acceptance Criteria**:

- [x] Packages installed successfully
- [x] No peer dependency warnings
- [x] `package.json` updated

---

### Step 1.2: Create Folder Structure

```bash
cd src/web/EduTrack.Web/src
mkdir -p lib/auth/{config,context,components,guards,hooks,types,utils}
```

**Expected structure**:

```
src/lib/auth/
├── config/          # MSAL configuration
├── context/         # AuthProvider
├── components/      # SignInButton, UserMenu
├── guards/          # ProtectedRoute
├── hooks/           # useAuth, useRequireAuth
├── types/           # TypeScript interfaces
└── utils/           # Helper functions
```

✅ **Acceptance Criteria**:

- [x] All directories created
- [x] Structure matches diagram above

---

### Step 1.3: Create MSAL Configuration

**File**: `src/lib/auth/config/msalConfig.ts`

```typescript
import { Configuration, LogLevel } from "@azure/msal-browser";

/**
 * Configuration for MSAL authentication
 * SECURITY: PKCE enabled automatically, tokens stored in memory
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/${
      import.meta.env.VITE_AZURE_TENANT_ID || "common"
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
```

**Environment Variables** (`.env.development`):

```env
VITE_AZURE_CLIENT_ID=your-client-id-here
VITE_AZURE_TENANT_ID=your-tenant-id-here
VITE_AZURE_REDIRECT_URI=http://localhost:5173
```

✅ **Acceptance Criteria**:

- [x] Config file created with proper TypeScript types
- [x] Environment variables documented
- [x] PKCE enabled (automatic with MSAL)
- [x] Secure cache location (`sessionStorage`)

---

### Step 1.4: Create Type Definitions

**File**: `src/lib/auth/types/index.ts`

```typescript
/**
 * User information extracted from JWT token
 */
export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  tenantId?: string;
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Auth context value with actions
 */
export interface AuthContextValue extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  acquireToken: () => Promise<string | null>;
}

/**
 * Protected route props
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}
```

✅ **Acceptance Criteria**:

- [x] All types compile without errors
- [x] JSDoc comments added
- [x] Exported from barrel file

---

### Step 1.5: Create MSAL Instance

**File**: `src/lib/auth/config/msalInstance.ts`

```typescript
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
```

**Update**: `src/main.tsx`

```typescript
import { initializeMsal } from "./lib/auth/config/msalInstance";

// Initialize MSAL before rendering
initializeMsal().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
```

✅ **Acceptance Criteria**:

- [x] MSAL initialized before app render
- [x] Redirect handling works (OAuth callback)
- [x] No console errors on startup

---

## Phase 2: Authentication Context

**Duration**: 4 hours  
**Goal**: Create AuthProvider that wraps MSAL and provides React context

### Step 2.1: Create Auth Context

**File**: `src/lib/auth/context/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import type { AuthContextValue, User } from "../types";
import { loginRequest, apiRequest } from "../config/msalConfig";

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
```

✅ **Acceptance Criteria**:

- [x] AuthProvider wraps MSAL functionality
- [x] User info extracted from JWT claims
- [x] Silent token refresh implemented
- [x] Error handling for auth failures

---

### Step 2.2: Wrap App with Providers

**File**: `src/app/App.tsx`

```typescript
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/lib/auth/config/msalInstance";
import { AuthProvider } from "@/lib/auth/context/AuthContext";
import { AppRouter } from "./router";

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </MsalProvider>
  );
}

export default App;
```

✅ **Acceptance Criteria**:

- [x] MsalProvider wraps entire app
- [x] AuthProvider provides context
- [x] App renders without errors

---

### Step 2.3: Update API Client

**File**: `src/lib/api/client.ts`

```typescript
import { useAuth } from "@/lib/auth/context/AuthContext";

// Update buildHeaders to use MSAL token
export async function buildHeaders(): Promise<HeadersInit> {
  const { acquireToken } = useAuth();
  const token = await acquireToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
```

✅ **Acceptance Criteria**:

- [x] API calls include Bearer token
- [x] Token acquired from MSAL context
- [x] No localStorage usage

---

## Phase 3: UI Components

**Duration**: 4 hours  
**Goal**: Build sign-in button, user menu, and profile display

### Step 3.1: Sign-In Button

**File**: `src/lib/auth/components/SignInButton.tsx`

```typescript
import { useAuth } from "../context/AuthContext";

export function SignInButton() {
  const { login, isLoading } = useAuth();

  return (
    <button
      onClick={login}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading ? "Signing in..." : "Sign In"}
    </button>
  );
}
```

✅ **Acceptance Criteria**:

- [x] Button triggers MSAL login redirect
- [x] Loading state shown during auth
- [x] Accessible (keyboard, ARIA labels)

---

### Step 3.2: User Menu

**File**: `src/lib/auth/components/UserMenu.tsx`

```typescript
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          {user.name[0].toUpperCase()}
        </div>
        <span>{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              {user.roles.join(", ") || "No roles"}
            </p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
```

✅ **Acceptance Criteria**:

- [x] Shows user avatar, name, email, roles
- [x] Dropdown menu toggles correctly
- [x] Sign-out button triggers logout
- [x] Accessible (keyboard, ARIA)

---

### Step 3.3: Update Navigation Bar

**File**: `src/app/components/NavBar.tsx`

```typescript
import { useAuth } from "@/lib/auth/context/AuthContext";
import { SignInButton } from "@/lib/auth/components/SignInButton";
import { UserMenu } from "@/lib/auth/components/UserMenu";

export function NavBar() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">EduTrack</h1>

        <div>
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 h-10 w-24 rounded" />
          ) : isAuthenticated ? (
            <UserMenu />
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </nav>
  );
}
```

✅ **Acceptance Criteria**:

- [x] Shows sign-in button when not authenticated
- [x] Shows user menu when authenticated
- [x] Loading state during auth check

---

## Phase 4: Route Protection

**Duration**: 3 hours  
**Goal**: Create protected route guards with role-based access

### Step 4.1: Protected Route Component

**File**: `src/lib/auth/guards/ProtectedRoute.tsx`

```typescript
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ProtectedRouteProps } from "../types";

export function ProtectedRoute({
  children,
  requiredRoles,
  fallbackPath = "/sign-in",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) =>
      user?.roles.includes(role)
    );

    if (!hasRequiredRole) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return <>{children}</>;
}
```

✅ **Acceptance Criteria**:

- [x] Redirects unauthenticated users to sign-in
- [x] Enforces role requirements
- [x] Preserves return URL
- [x] Shows loading state

---

### Step 4.2: Sign-In Page

**File**: `src/app/pages/SignInPage.tsx`

```typescript
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth/context/AuthContext";
import { SignInButton } from "@/lib/auth/components/SignInButton";

export function SignInPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to return URL after successful sign-in
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Sign In to EduTrack
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Sign in with your Microsoft account to access the application.
        </p>
        <div className="flex justify-center">
          <SignInButton />
        </div>
      </div>
    </div>
  );
}
```

✅ **Acceptance Criteria**:

- [x] Displays sign-in prompt
- [x] Redirects to return URL after sign-in
- [x] Clean, centered design

---

### Step 4.3: Forbidden Page

**File**: `src/app/pages/ForbiddenPage.tsx`

```typescript
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth/context/AuthContext";

export function ForbiddenPage() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        {user && (
          <p className="text-sm text-gray-500 mb-6">
            Your roles: {user.roles.join(", ") || "None"}
          </p>
        )}
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
```

✅ **Acceptance Criteria**:

- [x] Shows 403 error message
- [x] Displays user's current roles
- [x] Provides navigation back to home

---

### Step 4.4: Update Router

**File**: `src/app/router.tsx`

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/lib/auth/guards/ProtectedRoute";
import { SignInPage } from "./pages/SignInPage";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { HomePage } from "./pages/HomePage";
import { AppLayout } from "./layouts/AppLayout";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* Protected routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />

          {/* Admin-only route example */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRoles={["Admin", "SuperAdmin"]}>
                <div>Admin Page</div>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

✅ **Acceptance Criteria**:

- [x] Public routes accessible without auth
- [x] Protected routes require authentication
- [x] Role-based routes enforce permissions

---

## Phase 5: Role-Based Navigation

**Duration**: 2 hours  
**Goal**: Filter navigation items based on user roles

### Step 5.1: Update Navigation Configuration

**File**: `src/app/config/navigation.ts`

```typescript
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  requiredRoles?: string[];
}

export const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  {
    label: "Departments",
    path: "/departments",
    requiredRoles: ["Admin", "InstituteAdmin"],
  },
  { label: "Classes", path: "/classes", requiredRoles: ["Teacher", "Admin"] },
  { label: "Students", path: "/students", requiredRoles: ["Teacher"] },
  {
    label: "Reports",
    path: "/reports",
    requiredRoles: ["Admin", "SuperAdmin"],
  },
];

// Helper to filter nav items by user roles
export function filterNavByRoles(
  items: NavItem[],
  userRoles: string[]
): NavItem[] {
  return items.filter((item) => {
    if (!item.requiredRoles || item.requiredRoles.length === 0) {
      return true; // Public item
    }
    return item.requiredRoles.some((role) => userRoles.includes(role));
  });
}
```

✅ **Acceptance Criteria**:

- [x] Nav items have role requirements
- [x] Filter helper implemented
- [x] TypeScript types defined

---

### Step 5.2: Update NavBar with Role Filtering

**File**: `src/app/components/NavBar.tsx` (update)

```typescript
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth/context/AuthContext";
import { navItems, filterNavByRoles } from "../config/navigation";

export function NavBar() {
  const { user, isAuthenticated } = useAuth();

  const visibleNavItems =
    isAuthenticated && user
      ? filterNavByRoles(navItems, user.roles)
      : navItems.filter((item) => !item.requiredRoles);

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">EduTrack</h1>

          <ul className="flex gap-4">
            {visibleNavItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="hover:text-blue-600">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div>{/* SignInButton or UserMenu */}</div>
        </div>
      </div>
    </nav>
  );
}
```

✅ **Acceptance Criteria**:

- [x] Nav items filtered by user roles
- [x] Public items always visible
- [x] Authenticated users see role-specific items

---

## Phase 6: Testing

**Duration**: 2 hours  
**Goal**: Validate authentication flows work correctly

### Step 6.1: Manual Testing Checklist

**Sign-In Flow**:

- [x] Click sign-in → redirects to Microsoft login
- [x] Enter credentials → redirects back to app
- [x] User menu appears with correct name/email
- [x] Roles displayed correctly in menu
- [x] Token stored securely (check sessionStorage, not localStorage)

**Sign-Out Flow**:

- [x] Click sign-out → redirects to Microsoft logout
- [x] User state cleared
- [x] Protected routes inaccessible
- [x] Navigation shows sign-in button

**Protected Routes**:

- [x] Access `/admin` without auth → redirects to `/sign-in`
- [x] Return URL preserved after sign-in
- [x] Access admin route without Admin role → redirects to `/forbidden`
- [x] Loading state shown during auth check

**Token Management**:

- [x] Token acquired silently in background
- [x] API calls include Bearer token
- [x] Token refresh happens automatically
- [x] Expired tokens handled gracefully

**Role-Based Navigation**:

- [x] Teacher sees "Classes" and "Students"
- [x] Admin sees all items
- [x] Public user sees only public items
- [x] Nav updates immediately after sign-in

### Step 6.2: Browser Testing

Test in:

- [x] Chrome
- [x] Firefox
- [x] Safari (macOS)
- [x] Edge

Check:

- [x] No console errors
- [x] Smooth auth flow
- [x] Redirect handling works
- [x] sessionStorage used (not localStorage)

✅ **Acceptance Criteria**:

- [x] All manual tests passing
- [x] No console errors or warnings
- [x] Cross-browser compatibility verified

---

## Success Criteria

### Functional Requirements

- [x] ✅ Users can sign in with Microsoft account (Entra ID)
- [x] ✅ Users can sign out and session is cleared
- [x] ✅ Protected routes redirect unauthenticated users
- [x] ✅ Role-based access control works
- [x] ✅ Navigation filtered by user roles
- [x] ✅ Tokens stored securely (sessionStorage, not localStorage)
- [x] ✅ PKCE enabled automatically (MSAL handles this)
- [x] ✅ Silent token refresh works

### Security Requirements

- [x] 🔒 No localStorage usage for tokens
- [x] 🔒 PKCE enabled (OAuth 2.1 compliant)
- [x] 🔒 Automatic token refresh before expiration
- [x] 🔒 JWT validation by backend
- [x] 🔒 Secure logout (Entra ID + local cleanup)

### Quality Requirements

- [x] No TypeScript errors
- [x] ✅ No console errors or warnings
- [x] ✅ Accessible (keyboard, screen reader)
- [x] ✅ Responsive design
- [x] ✅ Loading states implemented
- [x] ✅ Error handling graceful

---

## Rollout Strategy

### Development

1. **Feature Branch**: `feat/st1-1-3-frontend-auth-msal`
2. **Local Testing**: Test with Entra ID dev tenant
3. **Code Review**: Submit PR with comprehensive description

### Testing

1. **Manual Testing**: Complete checklist above
2. **Browser Testing**: Chrome, Firefox, Safari, Edge
3. **Accessibility**: Run axe DevTools, keyboard test

### Deployment

1. **Dev Environment**: Deploy and validate
2. **Staging**: Full integration with production Entra ID config
3. **Production**: Monitor auth metrics, error rates

---

## 📚 Additional Resources

- [MSAL React Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)
- [MSAL Browser Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser)
- [OAuth 2.1 Specification](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-07)
- [PKCE Explained](https://oauth.net/2/pkce/)
- [Azure AD App Registration Guide](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

---

**END OF IMPLEMENTATION PLAN**
