# EduTrack — Vertical Slice Codex

<!-- EduTrack Codex v1.0 (Short Form) -->
**Mission:** Build EduTrack’s production-quality vertical slice (AZ-204 aligned, CI/CD for AZ-400) in 3 milestones on .NET 8 + Azure.

**MUSTs:** .NET 8 Minimal APIs + EF Core; React+Vite+Tailwind; Azure SQL (RLS, tenant_id), Service Bus, Functions (queue), Storage (Blob), Key Vault, App Insights, Redis, App Service, Static Web Apps, ACS Email. PDFs via QuestPDF.

**Multi-tenancy:** All tables include `tenant_id`. App queries filter by tenant. SQL RLS blocks cross-tenant reads/writes; verified by integration tests.

**Deliverables (each milestone):** Source + tests (unit/integration), EF migrations + seed, README/runbooks, Bicep, GitHub Actions, App Insights KQL.

**Milestones DoD:**
- **M1 Auth+Tenancy+Classes:** login works; RLS enforced (tests); CRUD per tenant; infra deployable.
- **M2 Invoices+Bulk+Email:** idempotent bulk; PDFs in Blob; ACS emails with SAS; monitoring & poison.
- **M3 Attendance+Apps+Perf:** batch attendance w/ row-version; public → approval; Redis cache-aside; CI/CD with blue-green.

**Conventions:** DTO≠Entity; pagination `?page & pageSize` + `X-Total-Count`; `X-Correlation-Id`, `X-Bulk-Request-Id`; SAS via Stored Access Policy; Managed Identity for secrets.

**Command Phrases:** “Begin M1/Step 1: Auth & Tenancy”, “Generate Bicep for SQL+RLS”, “Produce API for Enrollments (CRUD + paging)”, “Ship the PDF worker”, “Wire ACS Email with SAS”, “Provision CI/CD”.

**Acceptance Template:**  
Given [tenant], When [action], Then [behavior]; And RLS denies cross-tenant; And telemetry includes correlation/bulk IDs; And docs/samples updated.

---

## Repo Pointers
- Full Codex spec: [`/docs/CODEX.md`](docs/CODEX.md)
- PR checklist: auto-included from `.github/PULL_REQUEST_TEMPLATE.md`
- Feature issue template: `.github/ISSUE_TEMPLATE/feature.yml`

## Using the Codex
1. Keep the short form (above) in the **first screenful** of this README.
2. Any Codex change must be made in `/docs/CODEX.md` and shipped via PR using the checklist.
3. PRs must tick Codex checkboxes (acts like a soft gate).

## Next Action
Commit this package, then start the build with: **“Begin M1/Step 1: Auth & Tenancy.”**
