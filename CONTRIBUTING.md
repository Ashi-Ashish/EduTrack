## Branch Naming
Create branches from `main` using:
- Features: `feat/<epic>-<story>-<slug>`  (e.g., `feat/m1-classes-create-class`)
- Fixes:    `fix/<area>-<slug>`           (e.g., `fix/web-login-redirect`)
- Hotfix:   `hotfix/<yymmdd>-<slug>`      (e.g., `hotfix/251106-pdf-headers`)

## Commit Messages (Conventional Commits)
Use a type, optional scope, and a short action:
- `feat(api): add class create endpoint`
- `fix(web): correct login redirect`
- `docs: add RLS notes`
- `chore: update dependencies`
- `refactor(domain): simplify enrollment checks`
- `test(api): add integration tests for GET /classes`

Prefixes we use: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `build`, `ci`.
