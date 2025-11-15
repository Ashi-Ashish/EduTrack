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

## Frontend workflow & validation

Most day-to-day work happens inside `src/web/EduTrack.Web`. The steps below keep the React/Vite stack healthy when you pull new changes or add features:

1. `pnpm install` – run whenever `package.json`/`pnpm-lock.yaml` changes to guarantee local deps align with CI.
2. `pnpm lint` – executes ESLint with the shared config to catch regressions early.
3. `pnpm test` – runs the Vitest suite configured through `src/web/EduTrack.Web/src/setupTests.ts`, ensuring DOM mocks and accessibility helpers load before the specs.
4. `pnpm build` – verifies the production bundle (Vite + Tailwind) compiles before you push.
5. `pnpm dev` – manual smoke-test in the browser; use Chrome/Edge accessibility tooling to validate new UI or shared components under `src/web/EduTrack.Web/src/lib`.

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

## Authentication

The EduTrack API uses **JWT Bearer token authentication** integrated with Microsoft Entra ID (Azure AD).

### Configuration

Authentication settings are configured in `src/api/EduTrack.Api/appsettings.json`:

- **Authority**: The identity provider URL (Microsoft Entra ID tenant)
- **Audience**: The API identifier (e.g., `api://edutrack`)
- **RoleClaimType**: The claim type for user roles (default: `roles`)
- **TokenValidationParameters**: Fine-grained JWT validation settings

### Development Mode

For local development, `appsettings.Development.json` has relaxed validation settings:

- `ValidateIssuer`: false (allows testing with different token sources)
- `ValidateAudience`: false (flexible audience matching)
- `RequireHttpsMetadata`: false (works without SSL in dev)

### Testing Authentication

#### Automated Tests

Run the integration test suite:

```bash
dotnet test tests/EduTrack.Api.IntegrationTests
```

All tests follow the **MethodName_Scenario_ExpectedBehavior** naming convention (Roy Osherove pattern).

#### Manual Testing

Use the test endpoint to verify authentication:

**Public endpoint (no auth required):**

```bash
curl -i http://localhost:5000/health
# Expected: 200 OK with {"status":"ok"}
```

**Protected endpoint (requires valid JWT):**

```bash
# Without token (should fail)
curl -i http://localhost:5000/api/auth/test
# Expected: 401 Unauthorized

# With valid token
curl -i http://localhost:5000/api/auth/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
# Expected: 200 OK with user claims and roles
```

See `rest/auth.http` for more HTTP test examples.

### Security Considerations

- **Production**: Always use `RequireHttpsMetadata: true` and validate issuer/audience
- **Token Lifetime**: Tokens are validated with a 5-minute clock skew tolerance
- **Role-Based Access**: User roles are extracted from the `roles` claim in the JWT
- **No Token Storage**: `SaveToken: false` prevents tokens from being stored in authentication properties

For more details, see the [ASP.NET Core Authentication documentation](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/).

## Code Quality & Analyzers

- All .NET projects inherit nullable, analyzer, and warnings-as-errors settings from `Directory.Build.props`, plus `Microsoft.CodeAnalysis.NetAnalyzers` is pinned once so diagnostics stay consistent across Api, Domain, Infrastructure, Functions, and tests.
- `dotnet build` on a clean checkout must succeed with **zero warnings**; if you need to verify locally, run `dotnet restore && dotnet build` (the same sequence CI uses) and fix any analyzer output before committing.
- `dotnet format` will auto-fix style and whitespace issues; use `dotnet format --verify-no-changes` in pipelines or before pushing to ensure no pending formatting diffs.
- GitHub Actions runs `dotnet restore`, `dotnet build --no-restore`, and `dotnet test --no-build`, so any analyzer warning or formatting violation will fail the PR build.

## Dev Containers

- VS Code + Dev Containers (or `devcontainer CLI`) can open this repo via `.devcontainer/devcontainer.json`, which layers the official `mcr.microsoft.com/devcontainers/dotnet:8.0` image with Node LTS, GitHub CLI, Azure CLI, PowerShell, pnpm, and Azure Functions Core Tools v4.
- On first open the container installs global tooling via `npm install -g pnpm@9 azure-functions-core-tools@4`. Run `dotnet --info`, `node -v`, and `pnpm -v` inside the container to confirm the toolchain is ready before building.
- Common ports are forwarded automatically: 5000 (API), 7071 (Functions), and 5173 (Vite).
