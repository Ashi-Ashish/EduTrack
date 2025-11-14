# Frontend Structure Guide

This document explains the organization of the EduTrack frontend codebase located in `src/web/EduTrack.Web/src`.

## 📁 Directory Structure

```
src/
├── api/                       # HTTP client and API communication layer
│   ├── __tests__/            # API client unit tests
│   │   ├── client.test.ts
│   │   └── retry.test.ts
│   ├── config/               # Configuration and headers
│   │   ├── auth.ts           # Auth token and tenant ID helpers
│   │   ├── headers.ts        # Header building with auth/tenant/correlation
│   │   └── index.ts          # Config barrel exports
│   ├── core/                 # Core HTTP client functionality
│   │   ├── client.ts         # Main apiClient (GET, POST, PUT, PATCH, DELETE)
│   │   ├── response.ts       # Response handling and parsing
│   │   ├── retry.ts          # Retry logic with exponential backoff
│   │   ├── utils.ts          # Utilities (correlation IDs, URL building, sleep)
│   │   └── index.ts          # Core barrel exports
│   ├── types/                # Type definitions and errors
│   │   ├── errors.ts         # ApiError class and ValidationError types
│   │   ├── responses.ts      # PaginatedResponse and ApiResponse types
│   │   └── index.ts          # Types barrel exports
│   └── index.ts              # Public API exports
│
├── app/                       # Application shell and core UI
│   ├── components/           # Shared app-level components
│   │   ├── DarkModeToggle.tsx
│   │   ├── NavBar.tsx
│   │   └── index.ts
│   ├── layouts/              # Layout components
│   │   ├── AppLayout.tsx
│   │   └── index.ts
│   ├── pages/                # Core pages
│   │   ├── AboutPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── index.ts
│   ├── App.tsx               # Root application component
│   ├── navigation.ts         # Navigation menu configuration
│   ├── router.tsx            # React Router configuration
│   └── index.ts              # App barrel exports
│
├── auth/                      # Authentication module (ready for M1.1.3)
│   ├── components/           # Auth-related UI components (placeholder)
│   ├── context/              # Auth context and providers (placeholder)
│   ├── guards/               # Route guards and protected routes (placeholder)
│   ├── hooks/                # Auth hooks (useAuth, useUser, etc.) (placeholder)
│   └── types/                # Auth type definitions (placeholder)
│
├── config/                    # Application configuration
│   ├── api.config.ts         # API client config (base URL, timeouts, retry)
│   └── index.ts              # Config barrel exports
│
├── features/                  # Feature modules (domain-specific)
│   ├── applicants/           # Applicant management (placeholder)
│   │   └── index.ts
│   ├── attendance/           # Attendance tracking (placeholder)
│   │   └── index.ts
│   ├── classes/              # Class management (placeholder)
│   │   └── index.ts
│   ├── departments/          # Department management (placeholder)
│   │   └── index.ts
│   ├── enrollments/          # Student enrollment (placeholder)
│   │   └── index.ts
│   └── invoices/             # Invoice and billing (placeholder)
│       └── index.ts
│
├── lib/                       # Shared library code (no React dependencies)
│   ├── constants/            # Application-wide constants
│   │   └── index.ts          # HTTP status codes, regex patterns, storage keys
│   ├── utils/                # Pure utility functions
│   │   ├── classnames.ts     # CSS class name utilities (cn function)
│   │   ├── dates.ts          # Date formatting and manipulation
│   │   ├── strings.ts        # String utilities (capitalize, truncate, etc.)
│   │   └── index.ts          # Utils barrel exports
│   └── index.ts              # Lib barrel exports
│
├── shared/                    # Shared UI components and hooks
│   ├── components/           # Reusable UI components (placeholder)
│   ├── hooks/                # Custom React hooks (placeholder)
│   ├── types/                # Shared type definitions (placeholder)
│   └── utils/                # Shared UI utilities (placeholder)
│
├── styles/                    # Global styles and design tokens
│   ├── tailwind.css          # Tailwind CSS imports
│   └── tokens.css            # Design tokens (colors, spacing, typography)
│
├── tenancy/                   # Multi-tenancy module (ready for M1.3.1)
│   └── (empty - future structure)
│
├── global.d.ts                # Global TypeScript type declarations
├── main.tsx                   # Application entry point
├── README.md                  # Quick reference guide
└── setupTests.ts              # Vitest test setup and configuration

```

## 🎯 Design Principles

### 1. **Feature-Based Organization**

Each domain feature lives in its own folder under `features/`. This promotes:

- Clear boundaries between features
- Easy navigation and discoverability
- Independent testing and development

### 2. **Separation of Concerns**

#### API Layer (`api/`)

- **`core/`**: Core HTTP functionality - the main client, retry logic, and response handling
- **`config/`**: Configuration concerns - authentication, headers, and request setup
- **`types/`**: Type definitions - errors, validation, and response structures

#### Application Shell (`app/`)

- Contains the router, layouts, and core pages
- App-level components that appear across all features
- Navigation configuration

#### Shared Code (`lib/` vs `shared/`)

- **`lib/`**: Pure utility functions and constants (no React dependencies)
- **`shared/`**: Reusable React components and hooks

### 3. **Barrel Exports**

Each folder includes an `index.ts` that exports its public API:

```typescript
// Good: Import from the module
import { apiClient } from "@/api";
import { cn } from "@/lib/utils";

// Avoid: Deep imports (use sparingly for tree-shaking)
import { apiClient } from "@/api/core/client";
```

### 4. **Type Safety**

- All API responses are typed
- Error handling is structured with `ApiError`
- Validation errors include field-level details

## 📦 Key Modules

### API Client (`@/api`)

**Usage:**

```typescript
import { apiClient, ApiError } from "@/api";

try {
  const departments = await apiClient.get<Department[]>("/departments");
} catch (error) {
  if (error instanceof ApiError) {
    if (error.isValidationError()) {
      // Handle field validation errors
      error.errors?.forEach((e) => console.error(e.field, e.message));
    }
  }
}
```

**Features:**

- Automatic retry with exponential backoff
- Request timeout with AbortController
- Auth token and tenant ID injection
- Correlation IDs for request tracing
- Typed responses and errors

### Utilities (`@/lib`)

**Usage:**

```typescript
import { cn, formatDate, truncate, HTTP_STATUS } from "@/lib";

// Conditional CSS classes
const buttonClass = cn("btn", {
  "btn-active": isActive,
  "btn-disabled": isDisabled,
});

// Date formatting
const displayDate = formatDate(new Date(), "en-US", { dateStyle: "long" });

// String manipulation
const shortText = truncate("Long description here", 20);

// Constants
if (response.status === HTTP_STATUS.NOT_FOUND) {
  // Handle not found
}
```

### Application Shell (`@/app`)

The app shell provides:

- Routing via React Router
- App-level layout with header/navigation
- Dark mode toggle
- Core pages (home, about, 404)

## 🚀 Adding New Features

When adding a new feature:

1. **Create feature folder** under `features/`

   ```
   features/
   └── my-feature/
       ├── components/     # Feature-specific components
       ├── hooks/          # Feature-specific hooks
       ├── types/          # Feature type definitions
       ├── api.ts          # API calls for this feature
       └── index.ts        # Public exports
   ```

2. **Add routes** in `app/router.tsx`

   ```typescript
   <Route path="/my-feature" element={<MyFeaturePage />} />
   ```

3. **Add navigation** in `app/navigation.ts`

   ```typescript
   export const primaryNavigation: NavItem[] = [
     // ...
     { to: "/my-feature", label: "My Feature" },
   ];
   ```

4. **Use the API client** for backend communication

   ```typescript
   // features/my-feature/api.ts
   import { apiClient } from "@/api";

   export async function getMyData() {
     return apiClient.get<MyData[]>("/my-feature");
   }
   ```

## 🧪 Testing

- API tests: `src/api/__tests__/`
- Component tests: Co-located with components (e.g., `MyComponent.test.tsx`)
- Integration tests: `tests/EduTrack.Web.E2E/`

## 🔄 Migration from Old Structure

### Before (Flat structure)

```
api/
├── client.ts
├── auth.ts
├── headers.ts
├── errors.ts
├── responses.ts
├── retry.ts
└── utils.ts
```

### After (Organized structure)

```
api/
├── core/          # Core functionality grouped
├── config/        # Configuration grouped
├── types/         # Types grouped
└── index.ts       # Clean public API
```

**Benefits:**

- Better organization and discoverability
- Clear separation of concerns
- Easier to add new functionality
- Simpler mental model

## 📚 Additional Resources

- [API Client Documentation](./api/README.md) _(to be added)_
- [Component Guidelines](./shared/components/README.md) _(to be added)_
- [Testing Strategy](../../tests/README.md) _(to be added)_

---

**Last Updated:** November 14, 2025
**Applies to:** EduTrack v1.0 (Milestone M0-M1)
