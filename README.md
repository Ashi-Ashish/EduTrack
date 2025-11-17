<div align="center">

# 🎓 EduTrack

### Modern Multi-Tenant Teaching Institute Management System

[![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Azure](https://img.shields.io/badge/Azure-Cloud-0078D4?logo=microsoft-azure)](https://azure.microsoft.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Ashi-Ashish/EduTrack)

_A comprehensive, cloud-native platform for managing educational institutes with enterprise-grade security and multi-tenancy support. Built for Azure (AZ-204 aligned)._

[Features](#-features) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Documentation](#-documentation) • [Security](#-security)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Authentication & Authorization](#-authentication--authorization)
- [Development Workflow](#-development-workflow)
- [Testing](#-testing)
- [Code Quality](#-code-quality)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

EduTrack is a **production-ready, multi-tenant SaaS platform** designed for teaching institutes to manage students, courses, attendance, billing, and communications. Built with modern cloud-native architecture and enterprise security patterns.

### Why EduTrack?

- 🏢 **Multi-Tenant Architecture**: Secure tenant isolation at database, application, and API layers
- 🔒 **Enterprise Security**: JWT authentication, role-based authorization, Row-Level Security (RLS)
- ☁️ **Cloud-Native**: Designed for Azure with scalability and resilience built-in
- 🚀 **Modern Stack**: .NET 8 Minimal APIs + React 18 + TypeScript + Tailwind CSS
- 📊 **Real-Time Updates**: Azure Service Bus for event-driven workflows
- 🧪 **Test Coverage**: 40+ integration tests, comprehensive test automation

---

## ✨ Features

### 📚 Core Functionality

- **Student Management**: Enrollment, profiles, academic records
- **Course Administration**: Classes, schedules, curriculum management
- **Attendance Tracking**: Real-time attendance with mobile support
- **Billing & Invoicing**: Automated invoice generation, payment tracking
- **Guardian Portal**: Parent/guardian access to student information
- **Staff Management**: Role-based access for admins, teachers, volunteers

### 🔐 Security & Compliance

- **Microsoft Entra ID Integration**: Enterprise SSO with JWT tokens
- **7-Tier Role Hierarchy**: From SuperAdmin to Student with granular permissions
- **Multi-Tenant Isolation**: Database RLS + application-level validation
- **Audit Logging**: Comprehensive security event tracking
- **GDPR/FERPA Ready**: Privacy controls and data retention policies

### 🛠️ Platform Features

- **RESTful APIs**: Clean, documented endpoints with OpenAPI/Swagger
- **Event-Driven Architecture**: Azure Service Bus for async workflows
- **Email Notifications**: Azure Communication Services integration
- **File Storage**: Azure Blob Storage for documents and media
- **Caching**: Redis for high-performance data access
- **Monitoring**: Application Insights for observability

---

## 🛠 Tech Stack

### Backend

- **Runtime**: .NET 8 with C# 12
- **API Framework**: ASP.NET Core Minimal APIs
- **ORM**: Entity Framework Core 8
- **Authentication**: JWT Bearer with Microsoft Entra ID
- **Messaging**: Azure Service Bus
- **Functions**: Azure Functions (Serverless)

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **State Management**: React Context + Hooks
- **Testing**: Vitest + Testing Library

### Cloud Infrastructure (Azure)

- **Compute**: Azure App Service, Azure Functions
- **Database**: Azure SQL Database with Row-Level Security (RLS)
- **Storage**: Azure Blob Storage, Azure Redis Cache
- **Messaging**: Azure Service Bus
- **Security**: Azure Key Vault
- **Communication**: Azure Communication Services (Email)
- **Monitoring**: Azure Application Insights
- **IaC**: Bicep templates

### DevOps

- **Version Control**: Git with trunk-based development
- **CI/CD**: GitHub Actions
- **Testing**: xUnit, Vitest, Playwright (E2E)
- **Code Quality**: .NET Analyzers, ESLint, Prettier
- **Containerization**: Docker with Dev Containers

---

## 🚀 Getting Started

- .NET 8 SDK
- Node LTS + pnpm
- Azure Functions Core Tools v4
- GitHub CLI (optional for automation)

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- ✅ [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) (8.0 or later)
- ✅ [Node.js LTS](https://nodejs.org/) (v20+ recommended)
- ✅ [pnpm](https://pnpm.io/) (v9+) - `npm install -g pnpm`
- ✅ [Azure Functions Core Tools v4](https://learn.microsoft.com/azure/azure-functions/functions-run-local)
- ✅ [Git](https://git-scm.com/)
- ⚙️ [GitHub CLI](https://cli.github.com/) (optional, for automation)
- 🐳 [Docker Desktop](https://www.docker.com/products/docker-desktop) (optional, for dev containers)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Ashi-Ashish/EduTrack.git
cd EduTrack

# 2. Restore and build .NET projects
dotnet restore
dotnet build

# 3. Run the API (default: http://localhost:5050)
dotnet run --project src/api/EduTrack.Api

# 4. In a new terminal, start the frontend
cd src/web/EduTrack.Web
pnpm install
pnpm run dev  # Default: http://localhost:5173

# 5. (Optional) Start the Functions runtime
func start --csharp src/functions/EduTrack.Functions.Invoicing
```

### Verify Installation

```bash
# Check API health
curl http://localhost:5050/health
# Expected: {"status":"ok"}

# Check test endpoint (requires auth)
curl http://localhost:5050/api/auth/test
# Expected: 401 Unauthorized (auth working correctly)
```

### Development with Dev Containers

For a consistent development environment with all dependencies pre-configured:

```bash
# Using VS Code
code .
# Then: "Reopen in Container" from Command Palette (Ctrl+Shift+P)

# Using CLI
devcontainer open .
```

The dev container includes:

- .NET 8 SDK
- Node.js LTS + pnpm
- Azure Functions Core Tools v4
- GitHub CLI, Azure CLI, PowerShell
- All VS Code extensions pre-configured

---

## 🏗 Architecture

### Project Structure

```
EduTrack/
├── src/
│   ├── api/                       # 🌐 ASP.NET Core Minimal API
│   │   └── EduTrack.Api/
│   │       ├── Authorization/     # Role & policy definitions
│   │       ├── Features/          # Feature-organized endpoints
│   │       ├── Middleware/        # Custom middleware
│   │       ├── Persistence/       # Database context & configuration
│   │       └── Program.cs         # Application entry point
│   ├── domain/                    # 📦 Domain models & business logic
│   │   └── EduTrack.Domain/
│   │       ├── Education/         # Student, Course, Class entities
│   │       ├── Billing/           # Invoice, Payment entities
│   │       └── Tenancy/           # Multi-tenant support
│   ├── infrastructure/            # 🔧 External concerns
│   │   └── EduTrack.Infrastructure/
│   │       ├── Persistence/       # EF Core implementations
│   │       ├── Messaging/         # Service Bus integration
│   │       ├── Email/             # ACS email service
│   │       ├── Storage/           # Blob storage service
│   │       └── Caching/           # Redis cache service
│   ├── functions/                 # ⚡ Azure Functions
│   │   └── EduTrack.Functions.Invoicing/
│   │       └── Triggers/          # Service Bus triggers
│   └── web/                       # 🎨 React frontend
│       └── EduTrack.Web/
│           ├── src/
│           │   ├── components/    # Reusable UI components
│           │   ├── features/      # Feature modules
│           │   ├── lib/           # Utilities & hooks
│           │   └── pages/         # Route pages
│           └── public/            # Static assets
├── tests/                         # 🧪 Test projects
│   ├── EduTrack.Api.IntegrationTests/
│   ├── EduTrack.Domain.UnitTests/
│   ├── EduTrack.Functions.UnitTests/
│   └── EduTrack.Web.E2E/
├── infra/                         # ☁️ Infrastructure as Code
│   ├── bicep/                     # Azure Bicep templates
│   └── scripts/                   # Deployment scripts
└── rest/                          # 📡 HTTP test files
    └── auth.http                  # Manual API testing
```

### Design Principles

- **Clean Architecture**: Domain-centric design with clear separation of concerns
- **CQRS Pattern**: Separate read/write models for complex operations
- **Event-Driven**: Async workflows via Azure Service Bus
- **Feature Folders**: Organized by feature, not technical layer
- **Repository Pattern**: Abstraction over data access
- **Dependency Injection**: Constructor injection throughout

### Multi-Tenancy Model

```
┌─────────────────────────────────────────────────────────────┐
│                     Request Flow                             │
├─────────────────────────────────────────────────────────────┤
│  1. JWT Token → tenant_id claim extracted                   │
│  2. Authorization Handler → validates tenant context         │
│  3. Database Query → RLS filters by tenant_id               │
│  4. Response → scoped to authenticated tenant               │
└─────────────────────────────────────────────────────────────┘
```

**Three-Layer Isolation:**

1. **JWT Claims**: Tenant ID embedded in authentication token
2. **Application Layer**: Custom authorization handlers validate context
3. **Database Layer**: Row-Level Security (RLS) enforces data isolation

---

## 🔐 Authentication & Authorization

### Authentication Overview

EduTrack uses **JWT Bearer token authentication** with **Microsoft Entra ID** (Azure Active Directory) for enterprise-grade security.

**Authentication Flow:**

```
User → Entra ID Login → JWT Token → API Request → Token Validation → Access Granted
```

#### Configuration

Authentication is configured in `appsettings.json`:

```json
{
  "Authentication": {
    "Schemes": {
      "Bearer": {
        "Authority": "https://login.microsoftonline.com/{tenant-id}",
        "Audience": "api://edutrack",
        "RequireHttpsMetadata": true,
        "TokenValidationParameters": {
          "ValidateIssuer": true,
          "ValidateAudience": true,
          "ValidateLifetime": true,
          "ValidateIssuerSigningKey": true,
          "RoleClaimType": "roles",
          "ClockSkew": "00:05:00"
        }
      }
    }
  }
}
```

### Authorization Architecture

EduTrack implements a **comprehensive 7-tier role hierarchy** with **permission-based claims** and **custom authorization handlers** for multi-tenant security.

#### Role Hierarchy

| Role                 | Access Level        | Permissions                                   |
| -------------------- | ------------------- | --------------------------------------------- |
| **SuperAdmin**       | Platform-wide       | All operations across all tenants (support)   |
| **InstituteAdmin**   | Tenant-scoped       | Full access within assigned institute         |
| **InstituteManager** | Tenant-scoped       | Manage operations, **cannot** manage staff    |
| **Teacher**          | Course/Class-scoped | Manage assigned classes, students, attendance |
| **Volunteer**        | Limited assistance  | View assigned classes, assist activities      |
| **Guardian**         | Family-scoped       | View linked student(s) data only              |
| **Student**          | Individual-scoped   | View own data, submit assignments             |

### Permission Claims

In addition to roles, users can have **permission claims** for fine-grained access control:

- **`finance`**: Access billing, invoices, payments, financial reports
- **`attendance`**: Record and manage student attendance (for Volunteers)
- **`reports`**: Generate and view detailed reports
- **`settings`**: Configure institute settings and preferences

**Example JWT with permissions:**

```json
{
  "sub": "user-123",
  "role": "Teacher",
  "tenant_id": "institute-abc",
  "permission": ["finance", "reports"]
}
```

This Teacher can access teacher endpoints **plus** finance and reports features.

### Using Authorization Policies

#### Simple Role-Based

```csharp
// Require specific role
app.MapGet("/api/admin/users", handler)
   .RequireAuthorization(Policies.RequireInstituteAdmin);

// Require any management role (Admin OR Manager)
app.MapGet("/api/reports", handler)
   .RequireAuthorization(Policies.RequireManagement);

// Require academic staff (Admin, Manager, Teacher, or Volunteer)
app.MapGet("/api/classes", handler)
   .RequireAuthorization(Policies.RequireAcademicStaff);
```

#### Permission-Based (Role OR Claim)

```csharp
// Finance access: InstituteAdmin OR anyone with 'finance' permission
app.MapGet("/api/invoices", handler)
   .RequireAuthorization(Policies.RequireFinancePermission);

// Attendance recording: Management, Teacher, OR Volunteer with 'attendance' claim
app.MapPost("/api/attendance", handler)
   .RequireAuthorization(Policies.RequireAttendancePermission);
```

#### Tenant Isolation

```csharp
// Validates user's tenant_id claim matches {tenantId} in route
app.MapGet("/api/tenants/{tenantId}/students", handler)
   .RequireAuthorization(Policies.RequireTenantAccess);
```

**SuperAdmin bypasses tenant checks** for cross-tenant support operations.

#### Guardian-Student Relationship

```csharp
// Validates guardian has studentId in their 'guardian_of' claim
app.MapGet("/api/students/{studentId}/grades", handler)
   .RequireAuthorization(Policies.RequireGuardianOfStudent);
```

**Example guardian JWT:**

```json
{
  "sub": "guardian-user-id",
  "role": "Guardian",
  "tenant_id": "institute-123",
  "guardian_of": ["student-id-1", "student-id-2"] // Siblings
}
```

### Staff Management Restriction

**Key Security Rule**: Only **InstituteAdmin** can create, modify, or delete staff members. **InstituteManager** has broad operational access but **cannot** manage staff.

```csharp
// InstituteAdmin ONLY
app.MapPost("/api/staff", handler)
   .RequireAuthorization(Policies.RequireStaffManagement);

// InstituteAdmin OR InstituteManager
app.MapGet("/api/reports/operations", handler)
   .RequireAuthorization(Policies.RequireManagement);
```

This ensures proper oversight—only designated admins can hire/fire staff.

### Available Authorization Policies

**Role-Based:**

- `RequireSuperAdmin`, `RequireInstituteAdmin`, `RequireInstituteManager`
- `RequireTeacher`, `RequireVolunteer`, `RequireGuardian`, `RequireStudent`
- `RequireAnyAdmin` (SuperAdmin OR InstituteAdmin)
- `RequireManagement` (SuperAdmin, InstituteAdmin, OR InstituteManager)
- `RequireAcademicStaff` (Any staff role)
- `RequireStudentOrGuardian`

**Permission-Based:**

- `RequireFinancePermission`, `RequireAttendancePermission`
- `RequireReportsPermission`, `RequireSettingsPermission`

**Special Policies:**

- `RequireStaffManagement` (InstituteAdmin only)
- `RequireTenantAccess` (Validates tenant_id claim)
- `RequireGuardianOfStudent` (Validates guardian_of claim)
- `RequireResourceOwner` (Custom resource ownership)
- `RequireInstituteAdminOrOwner` (Admin OR resource owner)

### Testing Authorization

The integration test suite covers all authorization scenarios:

```bash
dotnet test tests/EduTrack.Api.IntegrationTests/Authorization
```

**Test Coverage:**

- ✅ 22 role-based policy tests
- ✅ 7 tenant isolation tests
- ✅ 8 guardian-student relationship tests
- ✅ 3 authentication baseline tests

**Total: 40 passing tests**

Test endpoints are available at `/api/test/*` for manual verification (see `rest/auth.http`).

### Multi-Tenant Security

Tenant isolation is enforced at **three layers**:

1. **JWT Claims**: `tenant_id` identifies user's tenant
2. **Authorization Handlers**: Validate tenant context on every request
3. **Database RLS**: Row-Level Security provides final data isolation

All tenant-scoped endpoints automatically validate the user's `tenant_id` claim matches the route parameter.

### Authorization Logging

Authorization events are logged for security monitoring:

```json
{
  "Logging": {
    "LogLevel": {
      "EduTrack.Api.Authorization": "Debug"
    }
  }
}
```

**Logged Events:**

- Authorization successes/failures
- Tenant validation attempts
- Guardian-student relationship checks
- Policy evaluation details

For security details, see [SECURITY_plan.md](./SECURITY_plan.md).

---

## 💻 Development Workflow

### Backend Development

```bash
# Restore dependencies
dotnet restore

# Build solution
dotnet build

# Run API with hot reload
dotnet watch --project src/api/EduTrack.Api

# Run specific tests
dotnet test tests/EduTrack.Api.IntegrationTests

# Run all tests with coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Frontend Development

```bash
cd src/web/EduTrack.Web

# Install dependencies (run after package.json changes)
pnpm install

# Start dev server with HMR
pnpm run dev

# Type checking
pnpm run type-check

# Linting
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

### Azure Functions Development

```bash
# Start Functions runtime locally
func start --csharp src/functions/EduTrack.Functions.Invoicing

# Test with local Service Bus (requires connection string in local.settings.json)
# Configure local.settings.json:
{
  "Values": {
    "ServiceBusConnection": "Endpoint=sb://..."
  }
}
```

### Code Quality Checks

```bash
# Format .NET code
dotnet format

# Verify no formatting changes needed
dotnet format --verify-no-changes

# Format frontend code
cd src/web/EduTrack.Web
pnpm run format

# Run all quality checks
./scripts/quality-check.sh  # (if available)
```

### Git Workflow

We follow **trunk-based development** with protected `main` branch:

```bash
# Create feature branch
git checkout -b feat/your-feature-name

# Make changes and commit (use Conventional Commits)
git add .
git commit -m "feat: add student enrollment feature"

# Push and create PR
git push origin feat/your-feature-name
# Then create PR via GitHub
```

**Conventional Commit Format:**

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions/changes
- `refactor:` - Code refactoring
- `chore:` - Build/config changes

---

## 🧪 Testing

### Test Strategy

EduTrack maintains comprehensive test coverage across all layers:

| Test Type             | Framework                     | Coverage                | Command                                           |
| --------------------- | ----------------------------- | ----------------------- | ------------------------------------------------- |
| **Integration Tests** | xUnit + WebApplicationFactory | 40+ tests               | `dotnet test tests/EduTrack.Api.IntegrationTests` |
| **Unit Tests**        | xUnit                         | Domain & Infrastructure | `dotnet test tests/EduTrack.Domain.UnitTests`     |
| **Frontend Unit**     | Vitest + Testing Library      | Components & hooks      | `cd src/web/EduTrack.Web && pnpm test`            |
| **E2E Tests**         | Playwright                    | Critical user flows     | `cd tests/EduTrack.Web.E2E && pnpm test`          |

### Running Tests

```bash
# Run all .NET tests
dotnet test

# Run with detailed output
dotnet test --logger "console;verbosity=detailed"

# Run specific test project
dotnet test tests/EduTrack.Api.IntegrationTests

# Run tests with code coverage
dotnet test --collect:"XPlat Code Coverage"

# Run frontend tests
cd src/web/EduTrack.Web
pnpm test

# Run E2E tests
cd tests/EduTrack.Web.E2E
pnpm test:e2e
```

### Test Coverage Highlights

**Authorization Tests** (40 tests, 100% passing):

- ✅ 22 role-based policy tests
- ✅ 7 tenant isolation tests
- ✅ 8 guardian-student relationship tests
- ✅ 3 authentication baseline tests

**Test Naming Convention:**  
`MethodName_Scenario_ExpectedBehavior` (Roy Osherove pattern)

Example:

```csharp
[Fact]
public async Task GetStudents_WithValidTeacherToken_ReturnsOk()
{
    // Arrange
    var token = JwtTokenGenerator.GenerateTeacherToken();

    // Act
    var response = await _client.GetAsync("/api/students");

    // Assert
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
}
```

### Manual API Testing

Use the `.http` files in the `rest/` directory for manual API testing with REST Client extension:

```bash
# View available test requests
cat rest/auth.http

# Or use curl
curl -i http://localhost:5050/health
curl -i http://localhost:5050/api/auth/test \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 Code Quality

### .NET Code Quality

All .NET projects enforce strict code quality standards via `Directory.Build.props`:

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  <EnableNETAnalyzers>true</EnableNETAnalyzers>
  <AnalysisLevel>latest</AnalysisLevel>
  <CodeAnalysisTreatWarningsAsErrors>true</CodeAnalysisTreatWarningsAsErrors>
</PropertyGroup>
```

**Zero Warnings Policy**: The build must succeed with **0 warnings** and **0 errors**.

```bash
# Verify build quality
dotnet restore && dotnet build
# Expected: Build succeeded. 0 Warning(s) 0 Error(s)

# Auto-fix formatting
dotnet format

# Verify no formatting changes needed (for CI)
dotnet format --verify-no-changes
```

### Frontend Code Quality

```bash
cd src/web/EduTrack.Web

# ESLint checking
pnpm run lint

# Auto-fix linting issues
pnpm run lint:fix

# Prettier formatting
pnpm run format

# TypeScript type checking
pnpm run type-check
```

### Analyzer Rules

- **Microsoft.CodeAnalysis.NetAnalyzers**: Comprehensive .NET code analysis
- **StyleCop**: Code style enforcement
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **EditorConfig**: Cross-editor consistency

### Pre-Commit Checks

Before committing, ensure:

1. ✅ All tests pass (`dotnet test` and `pnpm test`)
2. ✅ No build warnings (`dotnet build`)
3. ✅ Code is formatted (`dotnet format` and `pnpm run format`)
4. ✅ No linting errors (`pnpm run lint`)
5. ✅ TypeScript compiles (`pnpm run type-check`)

---

## 🐳 Dev Containers

Get a consistent development environment with all dependencies pre-configured using VS Code Dev Containers:

```bash
# Open in Dev Container (VS Code)
code .
# Command Palette: "Dev Containers: Reopen in Container"

# Or using CLI
devcontainer open .
```

**What's Included:**

- ✅ .NET 8 SDK
- ✅ Node.js LTS + pnpm
- ✅ Azure Functions Core Tools v4
- ✅ GitHub CLI, Azure CLI, PowerShell
- ✅ All VS Code extensions pre-configured
- ✅ Port forwarding: 5050 (API), 7071 (Functions), 5173 (Vite)

**Configuration:** `.devcontainer/devcontainer.json`

**Base Image:** `mcr.microsoft.com/devcontainers/dotnet:8.0`

**Verify Setup:**

```bash
# Inside dev container
dotnet --info
node -v
pnpm -v
func --version
```

---

## 🚢 Deployment

### Azure Infrastructure

Infrastructure is managed as code using **Bicep templates**:

```bash
# Deploy infrastructure
az deployment group create \
  --resource-group edutrack-rg \
  --template-file infra/bicep/main.bicep \
  --parameters @infra/bicep/parameters.prod.json

# Run post-deployment scripts
./infra/scripts/postdeploy/configure-database.sh
```

### CI/CD Pipeline

GitHub Actions workflow automatically:

- ✅ Builds and tests on every PR
- ✅ Enforces zero warnings policy
- ✅ Runs code quality checks
- ✅ Deploys to Azure (main branch)

**Workflow File:** `.github/workflows/ci-cd.yml`

### Deployment Checklist

- [ ] Update version numbers
- [ ] Run full test suite locally
- [ ] Update CHANGELOG.md
- [ ] Create git tag (`git tag v1.0.0`)
- [ ] Deploy infrastructure (Bicep)
- [ ] Deploy API to Azure App Service
- [ ] Deploy Functions to Azure Functions
- [ ] Deploy frontend to Azure Static Web Apps
- [ ] Run smoke tests in production
- [ ] Update documentation

---

## 📚 Documentation

### Available Documentation

- **[SECURITY_plan.md](./SECURITY_plan.md)** - Security architecture and best practices
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
- **[LICENSE](./LICENSE)** - MIT License details
- **[EduTrack_Delivery_Plan.md](./EduTrack_Delivery_Plan.md)** - Project roadmap and milestones

### API Documentation

Interactive API documentation via Swagger/OpenAPI:

```bash
# Start the API
dotnet run --project src/api/EduTrack.Api

# Open Swagger UI in browser
open http://localhost:5050/swagger
```

### Architecture Documentation

Key architectural patterns are documented in code:

- **Authorization**: `src/api/EduTrack.Api/Authorization/`
- **Domain Models**: `src/domain/EduTrack.Domain/`
- **Infrastructure**: `src/infrastructure/EduTrack.Infrastructure/`

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Contribution Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Follow** coding standards and write tests
4. **Commit** using Conventional Commits (`git commit -m 'feat: add amazing feature'`)
5. **Push** to your fork (`git push origin feat/amazing-feature`)
6. **Open** a Pull Request with clear description

### Development Guidelines

- Follow the existing code style and patterns
- Write comprehensive tests for new features
- Update documentation as needed
- Ensure all tests pass and build has zero warnings
- Use meaningful commit messages

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📞 Support & Community

- **Bug Reports**: [GitHub Issues](https://github.com/Ashi-Ashish/EduTrack/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/Ashi-Ashish/EduTrack/discussions)
- **Security Issues**: See [SECURITY_plan.md](./SECURITY_plan.md)
- **Documentation**: This README and linked docs

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ using .NET 8 and React 18
- Designed for Microsoft Azure (AZ-204 aligned)
- Inspired by enterprise SaaS architecture patterns
- Thanks to all contributors and the open-source community

---

<div align="center">

**[⬆ Back to Top](#-edutrack)**

Made with ❤️ by the EduTrack Team

[![GitHub Stars](https://img.shields.io/github/stars/Ashi-Ashish/EduTrack?style=social)](https://github.com/Ashi-Ashish/EduTrack)
[![GitHub Forks](https://img.shields.io/github/forks/Ashi-Ashish/EduTrack?style=social)](https://github.com/Ashi-Ashish/EduTrack/fork)

</div>
