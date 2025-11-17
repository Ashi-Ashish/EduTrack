using EduTrack.Api.Authorization.Requirements;

using Microsoft.AspNetCore.Authorization;

namespace EduTrack.Api.Authorization.Handlers;

/// <summary>
/// Handles guardian-student relationship authorization by validating the guardian's
/// 'guardian_of' claim contains the requested student ID.
/// </summary>
public class GuardianOfStudentAuthorizationHandler : AuthorizationHandler<GuardianOfStudentRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<GuardianOfStudentAuthorizationHandler> _logger;

    public GuardianOfStudentAuthorizationHandler(
        IHttpContextAccessor httpContextAccessor,
        ILogger<GuardianOfStudentAuthorizationHandler> logger)
    {
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        GuardianOfStudentRequirement requirement)
    {
        // SuperAdmin and InstituteAdmin bypass guardian checks
        if (context.User.IsInRole(Roles.SuperAdmin) || context.User.IsInRole(Roles.InstituteAdmin))
        {
            _logger.LogDebug("Admin role bypassing guardian-student check");
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Get guardian_of claim (contains array of student IDs)
        var guardianOfClaims = context.User.FindAll(requirement.GuardianOfClaimType);
        if (!guardianOfClaims.Any())
        {
            _logger.LogWarning("User does not have guardian_of claim");
            context.Fail();
            return Task.CompletedTask;
        }

        // Get requested student ID from route
        var httpContext = _httpContextAccessor.HttpContext;
        var requestedStudentId = httpContext?.Request.RouteValues[requirement.StudentIdRouteParameter]?.ToString();

        if (string.IsNullOrEmpty(requestedStudentId))
        {
            _logger.LogWarning("No student ID in route parameters");
            context.Fail();
            return Task.CompletedTask;
        }

        // Check if any guardian_of claim matches the requested student ID
        var hasAccess = guardianOfClaims.Any(c => c.Value == requestedStudentId);
        if (hasAccess)
        {
            _logger.LogDebug("Guardian relationship validated for student {StudentId}", requestedStudentId);
            context.Succeed(requirement);
        }
        else
        {
            _logger.LogWarning(
                "Guardian does not have access to student {StudentId}",
                requestedStudentId);
            context.Fail();
        }

        return Task.CompletedTask;
    }
}
