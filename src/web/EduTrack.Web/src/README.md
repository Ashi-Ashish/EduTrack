# EduTrack Frontend Source

This is the main source directory for the EduTrack web application.

## Quick Links

- 📖 **[Complete Structure Guide](../STRUCTURE.md)** - Detailed documentation of folder organization
- 🔌 **[API Client](./api/)** - HTTP client for backend communication
- 🎨 **[Application Shell](./app/)** - Core UI, routing, and layouts
- 🧩 **[Features](./features/)** - Domain-specific feature modules
- 🛠️ **[Shared Library](./lib/)** - Utilities and constants

## Getting Started

### Import Aliases

This codebase uses TypeScript path aliases for cleaner imports:

```typescript
import { apiClient } from "@/api"; // API client
import { App } from "@/app"; // Application shell
import { cn, formatDate } from "@/lib"; // Utilities
```

### Common Tasks

**Making API calls:**

```typescript
import { apiClient } from "@/api";

const data = await apiClient.get<MyType[]>("/endpoint");
```

**Creating a new feature:**

1. Create folder in `features/`
2. Add routes in `app/router.tsx`
3. Add navigation in `app/navigation.ts`

**Using utilities:**

```typescript
import { cn, formatDate, HTTP_STATUS } from "@/lib";

const className = cn("base", { active: isActive });
const date = formatDate(new Date());
```

## Structure at a Glance

```
src/
├── api/           # HTTP client and API layer
├── app/           # Application shell (router, layouts, core pages)
├── auth/          # Authentication (M1.1.3)
├── config/        # Application configuration
├── features/      # Feature modules (departments, classes, etc.)
├── lib/           # Shared utilities and constants
├── shared/        # Reusable UI components and hooks
├── styles/        # Global styles and design tokens
├── tenancy/       # Multi-tenancy (M1.3.1)
└── main.tsx       # Entry point
```

For detailed information, see [STRUCTURE.md](../STRUCTURE.md).
