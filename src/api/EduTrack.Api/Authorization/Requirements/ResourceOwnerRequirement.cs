using Microsoft.AspNetCore.Authorization;

namespace EduTrack.Api.Authorization.Requirements;

/// <summary>
/// Authorization requirement that validates the user owns or has been granted access
/// to the requested resource (e.g., a teacher owns a class, a student is enrolled).
/// </summary>
public class ResourceOwnerRequirement : IAuthorizationRequirement
{
    /// <summary>
    /// The claim type that contains the user's unique identifier.
    /// </summary>
    public string UserIdClaimType { get; } = "sub";
}
