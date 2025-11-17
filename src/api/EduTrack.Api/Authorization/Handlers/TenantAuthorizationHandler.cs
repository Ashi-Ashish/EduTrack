using EduTrack.Api.Authorization.Requirements;

using Microsoft.AspNetCore.Authorization;

namespace EduTrack.Api.Authorization.Handlers;

/// <summary>
/// Handles tenant-based authorization by validating the user's tenant claim
/// matches the requested tenant in the route.
/// </summary>
public class TenantAuthorizationHandler : AuthorizationHandler<TenantRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<TenantAuthorizationHandler> _logger;

    public TenantAuthorizationHandler(
        IHttpContextAccessor httpContextAccessor,
        ILogger<TenantAuthorizationHandler> logger)
    {
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        TenantRequirement requirement)
    {
        // SuperAdmin bypasses tenant checks
        if (context.User.IsInRole(Roles.SuperAdmin))
        {
            _logger.LogDebug("SuperAdmin bypassing tenant check");
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Get tenant ID from user's claims
        var tenantClaim = context.User.FindFirst(requirement.TenantClaimType);
        if (tenantClaim == null)
        {
            _logger.LogWarning("User does not have tenant_id claim");
            context.Fail();
            return Task.CompletedTask;
        }

        // Get requested tenant ID from route
        var httpContext = _httpContextAccessor.HttpContext;
        var requestedTenantId = httpContext?.Request.RouteValues[requirement.TenantRouteParameter]?.ToString();

        if (string.IsNullOrEmpty(requestedTenantId))
        {
            _logger.LogWarning("No tenant ID in route parameters");
            context.Fail();
            return Task.CompletedTask;
        }

        // Validate tenant match
        if (tenantClaim.Value == requestedTenantId)
        {
            _logger.LogDebug("Tenant validation successful for tenant {TenantId}", requestedTenantId);
            context.Succeed(requirement);
        }
        else
        {
            _logger.LogWarning(
                "Tenant mismatch: User tenant {UserTenant} attempted to access {RequestedTenant}",
                tenantClaim.Value,
                requestedTenantId);
            context.Fail();
        }

        return Task.CompletedTask;
    }
}
