using EduTrack.Api.Authorization;
using EduTrack.Api.Authorization.Handlers;
using EduTrack.Api.Authorization.Requirements;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Configure Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var authConfig = builder.Configuration.GetSection("Authentication:Schemes:Bearer");

    options.Authority = authConfig["Authority"];
    options.Audience = authConfig["Audience"];
    options.RequireHttpsMetadata = authConfig.GetValue("RequireHttpsMetadata", true);
    options.SaveToken = authConfig.GetValue("SaveToken", false);

    var validationParams = authConfig.GetSection("TokenValidationParameters");
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = validationParams.GetValue("ValidateIssuer", true),
        ValidateAudience = validationParams.GetValue("ValidateAudience", true),
        ValidateLifetime = validationParams.GetValue("ValidateLifetime", true),
        ValidateIssuerSigningKey = validationParams.GetValue("ValidateIssuerSigningKey", true),
        RoleClaimType = validationParams["RoleClaimType"] ?? "roles",
        ClockSkew = TimeSpan.Parse(validationParams["ClockSkew"] ?? "00:05:00")
    };

    // Add event handlers for debugging
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            var logger = context.HttpContext.RequestServices
                .GetRequiredService<ILogger<Program>>();
            logger.LogError(context.Exception, "Authentication failed");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            var logger = context.HttpContext.RequestServices
                .GetRequiredService<ILogger<Program>>();
            logger.LogDebug("Token validated for {User}",
                context.Principal?.Identity?.Name ?? "Unknown");
            return Task.CompletedTask;
        }
    };
});

// Register IHttpContextAccessor (required for handlers)
builder.Services.AddHttpContextAccessor();

// Configure Authorization with policies using modern builder pattern
var authorizationBuilder = builder.Services.AddAuthorizationBuilder();

// Simple role-based policies
authorizationBuilder.AddPolicy(Policies.RequireSuperAdmin, policy =>
    policy.RequireRole(Roles.SuperAdmin));

authorizationBuilder.AddPolicy(Policies.RequireInstituteAdmin, policy =>
    policy.RequireRole(Roles.InstituteAdmin));

authorizationBuilder.AddPolicy(Policies.RequireInstituteManager, policy =>
    policy.RequireRole(Roles.InstituteManager));

authorizationBuilder.AddPolicy(Policies.RequireTeacher, policy =>
    policy.RequireRole(Roles.Teacher));

authorizationBuilder.AddPolicy(Policies.RequireVolunteer, policy =>
    policy.RequireRole(Roles.Volunteer));

authorizationBuilder.AddPolicy(Policies.RequireGuardian, policy =>
    policy.RequireRole(Roles.Guardian));

authorizationBuilder.AddPolicy(Policies.RequireStudent, policy =>
    policy.RequireRole(Roles.Student));

// Combined role policies
authorizationBuilder.AddPolicy(Policies.RequireAnyAdmin, policy =>
    policy.RequireRole(Roles.SuperAdmin, Roles.InstituteAdmin));

authorizationBuilder.AddPolicy(Policies.RequireManagement, policy =>
    policy.RequireRole(Roles.SuperAdmin, Roles.InstituteAdmin, Roles.InstituteManager));

authorizationBuilder.AddPolicy(Policies.RequireAcademicStaff, policy =>
    policy.RequireRole(Roles.SuperAdmin, Roles.InstituteAdmin, Roles.InstituteManager, Roles.Teacher, Roles.Volunteer));

authorizationBuilder.AddPolicy(Policies.RequireStudentOrGuardian, policy =>
    policy.RequireRole(Roles.Student, Roles.Guardian));

// Permission-based policies (anyone with the permission claim)
authorizationBuilder.AddPolicy(Policies.RequireFinancePermission, policy =>
    policy.RequireAssertion(context =>
        context.User.IsInRole(Roles.SuperAdmin) ||
        context.User.IsInRole(Roles.InstituteAdmin) ||
        context.User.HasClaim(Permissions.ClaimType, Permissions.Finance)));

authorizationBuilder.AddPolicy(Policies.RequireAttendancePermission, policy =>
    policy.RequireAssertion(context =>
        context.User.IsInRole(Roles.SuperAdmin) ||
        context.User.IsInRole(Roles.InstituteAdmin) ||
        context.User.IsInRole(Roles.InstituteManager) ||
        context.User.IsInRole(Roles.Teacher) ||
        (context.User.IsInRole(Roles.Volunteer) &&
         context.User.HasClaim(Permissions.ClaimType, Permissions.Attendance))));

authorizationBuilder.AddPolicy(Policies.RequireReportsPermission, policy =>
    policy.RequireAssertion(context =>
        context.User.IsInRole(Roles.SuperAdmin) ||
        context.User.IsInRole(Roles.InstituteAdmin) ||
        context.User.IsInRole(Roles.InstituteManager) ||
        context.User.HasClaim(Permissions.ClaimType, Permissions.Reports)));

authorizationBuilder.AddPolicy(Policies.RequireSettingsPermission, policy =>
    policy.RequireAssertion(context =>
        context.User.IsInRole(Roles.SuperAdmin) ||
        context.User.IsInRole(Roles.InstituteAdmin) ||
        context.User.HasClaim(Permissions.ClaimType, Permissions.Settings)));

// Staff management restricted to InstituteAdmin only
authorizationBuilder.AddPolicy(Policies.RequireStaffManagement, policy =>
    policy.RequireRole(Roles.SuperAdmin, Roles.InstituteAdmin));

// Custom requirement policies
authorizationBuilder.AddPolicy(Policies.RequireTenantAccess, policy =>
    policy.Requirements.Add(new TenantRequirement()));

authorizationBuilder.AddPolicy(Policies.RequireResourceOwner, policy =>
    policy.Requirements.Add(new ResourceOwnerRequirement()));

authorizationBuilder.AddPolicy(Policies.RequireGuardianOfStudent, policy =>
    policy.Requirements.Add(new GuardianOfStudentRequirement()));

// Combined policy with assertion
authorizationBuilder.AddPolicy(Policies.RequireInstituteAdminOrOwner, policy =>
    policy.RequireAssertion(context =>
        context.User.IsInRole(Roles.InstituteAdmin) ||
        context.User.HasClaim(c => c.Type == "resource_owner" && c.Value == "true")));

// Register custom authorization handlers
builder.Services.AddScoped<IAuthorizationHandler, TenantAuthorizationHandler>();
builder.Services.AddScoped<IAuthorizationHandler, ResourceOwnerAuthorizationHandler>();
builder.Services.AddScoped<IAuthorizationHandler, GuardianOfStudentAuthorizationHandler>();

var app = builder.Build();

// Middleware order is critical!
app.UseAuthentication();
app.UseAuthorization();

// Public health endpoint
app.MapGet("/health", () => Results.Ok(new { status = "ok" }))
    .WithName("Health");

// Protected test endpoint
app.MapGet("/api/auth/test", (HttpContext context) =>
{
    var user = context.User;
    var claims = user.Claims.Select(c => new { c.Type, c.Value });

    return Results.Ok(new
    {
        authenticated = user.Identity?.IsAuthenticated ?? false,
        name = user.Identity?.Name,
        roles = user.FindAll("roles").Select(c => c.Value),
        claims
    });
})
.RequireAuthorization()
.WithName("AuthTest");

// Test endpoints for each role
app.MapGet("/api/test/superadmin", () => Results.Ok(new { message = "SuperAdmin access granted" }))
    .RequireAuthorization(Policies.RequireSuperAdmin)
    .WithName("TestSuperAdmin");

app.MapGet("/api/test/admin", () => Results.Ok(new { message = "Admin access granted" }))
    .RequireAuthorization(Policies.RequireAnyAdmin)
    .WithName("TestAdmin");

app.MapGet("/api/test/teacher", () => Results.Ok(new { message = "Teacher access granted" }))
    .RequireAuthorization(Policies.RequireTeacher)
    .WithName("TestTeacher");

app.MapGet("/api/test/manager", () => Results.Ok(new { message = "InstituteManager access granted" }))
    .RequireAuthorization(Policies.RequireInstituteManager)
    .WithName("TestInstituteManager");

app.MapGet("/api/test/volunteer", () => Results.Ok(new { message = "Volunteer access granted" }))
    .RequireAuthorization(Policies.RequireVolunteer)
    .WithName("TestVolunteer");

app.MapGet("/api/test/guardian", () => Results.Ok(new { message = "Guardian access granted" }))
    .RequireAuthorization(Policies.RequireGuardian)
    .WithName("TestGuardian");

app.MapGet("/api/test/student", () => Results.Ok(new { message = "Student access granted" }))
    .RequireAuthorization(Policies.RequireStudent)
    .WithName("TestStudent");

// Test permission-based endpoints
app.MapGet("/api/test/finance", () => Results.Ok(new { message = "Finance permission granted" }))
    .RequireAuthorization(Policies.RequireFinancePermission)
    .WithName("TestFinancePermission");

app.MapGet("/api/test/attendance-record", () => Results.Ok(new { message = "Attendance permission granted" }))
    .RequireAuthorization(Policies.RequireAttendancePermission)
    .WithName("TestAttendancePermission");

// Test staff management endpoint (InstituteAdmin only)
app.MapPost("/api/test/staff", () => Results.Ok(new { message = "Staff created" }))
    .RequireAuthorization(Policies.RequireStaffManagement)
    .WithName("TestStaffManagement");

// Test tenant-scoped endpoint
app.MapGet("/api/tenants/{tenantId}/test", (string tenantId) =>
    Results.Ok(new { message = $"Access granted to tenant {tenantId}" }))
    .RequireAuthorization(Policies.RequireTenantAccess)
    .WithName("TestTenant");

// Test guardian-student relationship endpoint
app.MapGet("/api/students/{studentId}/guardian-access", (string studentId) =>
    Results.Ok(new { message = $"Guardian access granted to student {studentId}" }))
    .RequireAuthorization(Policies.RequireGuardianOfStudent)
    .WithName("TestGuardianOfStudent");

app.Run();

// Make the implicit Program class accessible to tests
// This is a standard ASP.NET Core pattern for integration testing
// See: https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests
public partial class Program { }
