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

## Code Quality & Analyzers
- All .NET projects inherit nullable, analyzer, and warnings-as-errors settings from `Directory.Build.props`, plus `Microsoft.CodeAnalysis.NetAnalyzers` is pinned once so diagnostics stay consistent across Api, Domain, Infrastructure, Functions, and tests.
- `dotnet build` on a clean checkout must succeed with **zero warnings**; if you need to verify locally, run `dotnet restore && dotnet build` (the same sequence CI uses) and fix any analyzer output before committing.
- `dotnet format` will auto-fix style and whitespace issues; use `dotnet format --verify-no-changes` in pipelines or before pushing to ensure no pending formatting diffs.
- GitHub Actions runs `dotnet restore`, `dotnet build --no-restore`, and `dotnet test --no-build`, so any analyzer warning or formatting violation will fail the PR build.

## Dev Containers
- VS Code + Dev Containers (or `devcontainer CLI`) can open this repo via `.devcontainer/devcontainer.json`, which layers the official `mcr.microsoft.com/devcontainers/dotnet:8.0` image with Node LTS, GitHub CLI, Azure CLI, PowerShell, pnpm, and Azure Functions Core Tools v4.
- On first open the container installs global tooling via `npm install -g pnpm@9 azure-functions-core-tools@4`. Run `dotnet --info`, `node -v`, and `pnpm -v` inside the container to confirm the toolchain is ready before building.
- Common ports are forwarded automatically: 5000 (API), 7071 (Functions), and 5173 (Vite).
