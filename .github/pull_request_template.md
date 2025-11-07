## What
Explain the change in 1–3 bullets.

## Why
Link the issue/epic and the user impact.

## How
Key design choices, trade-offs, and risks.

## Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual checks (commands, screenshots, or steps)

## Multi-tenancy / RLS
- [ ] Affects tenant boundaries or RLS
- [ ] Added/updated migration + predicate tests
- [ ] Verified per-tenant filter in queries

## Infra
- [ ] Bicep updated
- [ ] `what-if` output attached (if infra changed)

## Observability
- [ ] App Insights telemetry/correlation added
- [ ] `X-Bulk-Request-Id` (if bulk)

## CI
- [ ] Builds pass (`build-dotnet`, `build-web`)
- [ ] Lints/analyzers pass

## Notes for Reviewers
Anything reviewers should focus on or ignore.


---

**Link issues with keywords:** e.g., `Closes #123`, `Fixes #456`.

**Commit style:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`).
