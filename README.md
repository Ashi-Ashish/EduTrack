# EduTrack

A multi-tenant teaching-institute app (AZ-204 aligned).
- Backend: .NET 8 Minimal APIs + EF Core
- Frontend: React + Vite + Tailwind
- Azure: SQL (RLS), Service Bus, Functions, Storage, Key Vault, ACS (Email), App Insights, Redis

## Getting Started (local)
- .NET 8 SDK
- Node LTS + pnpm
- GitHub CLI (optional for automation)

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

## Continuous Integration
- `.github/workflows/ci.yml` defines the required jobs `build-dotnet` and `build-web`.
- Branch protection only allows merges when both jobs are green, so keep the job names stable (or update the protection rule before renaming them).
- Jobs auto-detect .NET solutions/projects and web packages; expand their steps with real builds/tests as the codebase fills in.
