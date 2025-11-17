using Microsoft.AspNetCore.Authorization;

namespace EduTrack.Api.Authorization.Requirements;

/// <summary>
/// Authorization requirement that validates the user belongs to the requested tenant.
/// SuperAdmin role bypasses this check for cross-tenant support access.
/// </summary>
public class TenantRequirement : IAuthorizationRequirement
{
    /// <summary>
    /// The claim type that contains the user's tenant ID.
    /// </summary>
    public string TenantClaimType { get; } = "tenant_id";

    /// <summary>
    /// The route parameter name containing the requested tenant ID.
    /// </summary>
    public string TenantRouteParameter { get; } = "tenantId";
}
