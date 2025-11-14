# EduTrack Web Shell

Tailwind v4, Vite, and React Router power this scaffold for **Story M0.2 → Task ST0.2.1**. It gives the team a themed layout, routing skeleton, and live dev experience before wiring APIs, accessibility linting, or auth flows.

## Quick start

```bash
pnpm install           # first time per clone
pnpm dev               # http://localhost:5173

pnpm build             # type-check + production build
pnpm preview           # serve the build locally
pnpm test              # vitest suite for HTTP client utilities
pnpm api:health        # CLI smoke test against /health using apiClient
```

## What’s included

- Tailwind CSS **v4** via `@tailwindcss/vite` (config-optional flow) plus a tiny `@theme` block for brand tokens and fonts.
- Global layout + dark mode toggle managed through the root `dark` class.
- React Router demo routes (`/`, `/about`) and a catch-all 404 page.
- Responsive container + typography spacing utilities ready for future feature modules.
- Fetch-based HTTP client (`src/api`) with retries, timeouts, tenant/auth headers, and centralized config.

## HTTP client usage

- Configure `VITE_API_BASE_URL` in `.env.local` (see `.env.example`) so `apiConfig.baseUrl` hits the right backend.
- Import from the barrel (`import { apiClient } from '@/api'`) and call the provided verbs (`get`, `post`, `put`, `patch`, `delete`).
- Per-request overrides live on `RequestOptions` (timeouts, retry counts, bulk correlation IDs, etc.).
- Failures throw `ApiError`, which includes HTTP status plus optional validation metadata for forms.

```ts
import { apiClient } from '@/api'

const departments = await apiClient.get<Department[]>('/departments', {
  timeout: 10_000,
  bulkRequestId: 'onboarding-2025-01',
})
```

## Testing & health checks

1. `pnpm test` runs the Vitest suite that exercises retry/backoff, timeout cancellation, and `ApiError` propagation.
2. `pnpm api:health` reuses the shared client to hit `/health` on the configured backend and surfaces structured failures.
3. Ensure the backend is reachable (e.g., `dotnet run` inside the API solution or point `VITE_API_BASE_URL` at staging) before executing the health-check script.

## Reference plans

- [`EduTrack_Delivery_Plan.md`](../../../EduTrack_Delivery_Plan.md) — Story M0.2 ↔ ST0.2.1 scope and acceptance criteria.
- [`STRUCTURE_GUIDE_Plan.md`](./STRUCTURE_GUIDE_Plan.md) — Visual shell + routing expectations.
- [`FRONTEND_ARCHITECTURE_Plan.md`](./FRONTEND_ARCHITECTURE_Plan.md) — Folder conventions and milestone mapping.

## Manual verification

1. `pnpm dev`, visit `/` and `/about`, toggle dark mode, and edit a utility class (e.g., change `bg-brand-500`) to confirm HMR.
2. Navigate to a random path to verify the Not Found page.
3. `pnpm build && pnpm preview` to ensure Tailwind CSS is fully processed (no raw `@import "tailwindcss"` in `dist`) and the layout looks correct on sm/md/lg widths.

### Latest verification log

- `pnpm dev` — ✅ boots and serves on http://localhost:5173 (terminated after smoke-check).
- `pnpm build` — ✅ succeeds (TypeScript + Vite).
- `pnpm preview` — ✅ serves production build (terminated after smoke-check).
- `pnpm lint` — ✅ passes with no violations.

## Notes & risks

- Tailwind v4 is pinned with `@tailwindcss/vite`. If a future upgrade breaks the build, temporarily fall back to Tailwind 3.4 + PostCSS and document the delta here.
- If you introduce a `tailwind.config.ts`, include `content: ['./index.html', './src/**/*.{ts,tsx}']` so production builds retain the utilities you use.
- Keep new feature routes under `src/app/pages` and wrap them with `AppLayout` to preserve spacing, typography, and theme toggles.
