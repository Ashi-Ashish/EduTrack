# EduTrack

A multi-tenant teaching-institute app (AZ-204 aligned).
- Backend: .NET 8 Minimal APIs + EF Core
- Frontend: React + Vite + Tailwind
- Azure: SQL (RLS), Service Bus, Functions, Storage, Key Vault, ACS (Email), App Insights, Redis

## Getting Started (local)
- .NET 8 SDK
- Node LTS + pnpm
- Azure Functions Core Tools v4
- GitHub CLI (optional for automation)

### Quickstart commands
1. `dotnet restore && dotnet build` – compiles Api/Domain/Infrastructure/Functions via `EduTrack.sln`.
2. `dotnet run --project src/api/EduTrack.Api` – launches the Minimal API; probe `/health`.
3. `func start --c src/functions/EduTrack.Functions.Invoicing` – runs the Service Bus worker (set `ServiceBusConnection` in `local.settings.json`).
4. `cd src/web/EduTrack.Web && pnpm install && pnpm run dev` – installs dependencies and serves the Vite shell.

## Monorepo layout (initial sketch)
- `src/api` – ASP.NET Core Minimal API
- `src/functions` – Azure Functions (queue trigger)
- `src/web` – React app (Vite)
- `infra/bicep` – Bicep IaC
- `tests` – unit/integration tests
- `rest` – HTTP client samples

## Conventions
- Trunk-based, PRs only to `main` (protected)
- Conventional Commits
- Tenant isolation via RLS + app guards
