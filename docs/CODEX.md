# EduTrack Codex (Extended) — v1.0

## Mission
Build **EduTrack**, a multi-tenant teaching-institute app, as a production-quality vertical slice aligned to **AZ-204**, wired for **AZ-400** CI/CD, delivered in **3 milestones** with clean, testable **.NET 8** code, IaC, docs, and seed data.

## Tech Contract (MUSTs)
- **Backend:** .NET 8 Minimal APIs, EF Core, policy-based auth.
- **Frontend:** React + Vite + Tailwind, role-aware routes.
- **Azure:** SQL (RLS per tenant), Service Bus, Functions (queue trigger), Storage (Blob), Key Vault, App Insights, Azure Cache for Redis, App Service (API), Static Web Apps (frontend), Azure Communication Services (Email).
- **PDFs:** QuestPDF (free/community).
- **Multi-tenancy:** `tenant_id` everywhere; SQL **Row-Level Security (RLS)** + app-side guards.
- **Roles:** Student, Guardian, Volunteer, Teacher, Admin, Admin(Finance), Volunteer(Finance).

## Deliverables (every milestone)
- Source code (vertical feature folders), DTOs != Entities, analyzers on, nullable enabled.
- Unit + integration tests (WebApplicationFactory), EF migrations, seed data.
- README runbooks, Postman/HTTP samples.
- **Bicep** for all Azure resources.
- GitHub Actions workflows.
- App Insights KQL dashboard + correlation (API → queue → worker).
- Mapping doc: “How this maps to AZ-204/AZ-400.”

## Milestones & Definition of Done

### M1 — Auth + Tenancy + Classes
- Entra ID or ASP.NET Identity; policy-based roles; tenant resolution (subdomain or header).
- Entities & CRUD: Departments, Classes, Enrollments; paging & validation.
- Azure SQL RLS policies + tests; indexes on (tenant_id, class_id, date).
- Frontend: sign-in/out, base CRUD screens.
- Infra: Bicep for SQL, App Service, Key Vault, Service Bus, Storage, App Insights.
**DoD:** Login works; RLS enforced by tests; CRUD functional per tenant; infra deployable; smoke tests green.

### M2 — Invoices + Bulk + Email
- REST: issue single/bulk invoices; idempotency keys; enqueue to Service Bus.
- Azure Functions worker: generate PDF with QuestPDF, save to Blob, write status back.
- Email via Azure Communication Services; SAS links with Stored Access Policy.
- Monitoring: retries, poison queue, alerts, KQL dashboard.
**DoD:** Bulk job idempotent; PDFs in Blob; emails delivered; failures observable and recoverable.

### M3 — Attendance + Public Applications + Perf
- Fast attendance (batch patch) with row-versioning for concurrency.
- Public application form → review → minimal user record → approval email.
- Redis cache-aside for hot lookups; keys include `tenant_id`.
- CI/CD: build/test, infra deploy (Bicep), blue-green App Service slot swap, smoke tests.
**DoD:** Attendance optimistic UI; public → approved flow; cache hits visible; full pipeline passes and swaps.

## Working Pattern
Each step response follows this structure:
1) Plan  2) Tradeoffs  3) Code  4) Tests  5) Study Pack  6) Quiz (3 Qs).  
We do not proceed until the quiz is passed. Partial completions allowed; everything compiles.

## Security & Tenancy Rules
- All tables **MUST** include `tenant_id` (non-null).
- App-side filters **MUST** include `Where(e => e.TenantId == context.TenantId)` even with RLS.
- RLS security predicates **MUST** block cross-tenant reads/writes; proven in integration tests.
- SAS tokens issued via **Stored Access Policies**; short TTL; no client secrets.
- Managed Identity for secrets; Key Vault for secrets and ACS keys.

## API Conventions
- Minimal APIs; vertical feature folders: `/Features/<Area>/<Operation>`.
- DTOs != Entities; explicit mapping.
- Pagination: `?page=1&pageSize=50`, return `X-Total-Count`.
- Idempotency: bulk endpoints require `X-Bulk-Request-Id`; store request hash.
- Correlation: emit `X-Correlation-Id`; propagate to Service Bus properties.

## Background Processing
- Azure Functions (Isolated) queue triggers with retries + poison queue.
- Observability: correlation id logged at API, queue, worker; traces linked in App Insights.
- Idempotent workers (dedupe on `X-Bulk-Request-Id` or invoice GUID).

## Frontend Principles
- Role-aware routes, guards at router level.
- Optimistic UI for attendance; reconcile via row-version.
- Accessibility baked in; Tailwind for styling.

## Caching Contract
- Redis cache-aside; keys: `et:<tenant_id>:<domain>:<key>`.
- TTL defaults 10–60 min; invalidate on writes.

## Storage & Email
- Blob containers: `invoices` (PDF) with versioning.
- SAS links only (no attachments); short TTL; issued server-side.
- Email via ACS; templates are simple and tenant-branded later.

## Repository Structure
```
/src
  /Api
  /Worker (Azure Functions)
  /Web (React + Vite)
/infra
  main.bicep, modules/* (sql, appsvc, kv, sbus, storage, insights, redis, acs)
/tests
  /Unit
  /Integration
/docs
  README.md, RUNBOOK.md, KQL.md, AZ204_MAP.md, AZ400_PIPELINE.md
```

## Branching & CI/CD
- Branches: `main` (prod), `dev` (integration), `feat/*`.
- PR checklist: build, tests, lint, EF migrations, Bicep what-if, preview deploy to slot, smoke tests.
- Release: blue-green slot swap, then tag.

## Command Phrases
- “Begin M1/Step 1: Auth & Tenancy”
- “Generate Bicep for SQL+RLS”
- “Produce API for Enrollments (CRUD + paging)”
- “Design RLS predicates”
- “Ship the PDF worker”
- “Wire ACS Email with SAS”
- “Add Redis cache-aside for schedules”
- “Create App Insights KQL dashboard”
- “Provision CI/CD”

## Acceptance Criteria Template
- **Given** [tenant/resolved identity]
- **When** [action/endpoint]
- **Then** [behavior]
- **And** RLS prevents cross-tenant access (integration test proves it)
- **And** telemetry includes correlation and bulk IDs
- **And** docs and samples updated

## ChangeLog
- v1.0 — Initial Codex published.
