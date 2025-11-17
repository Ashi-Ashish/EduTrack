using EduTrack.Api.Authorization.Requirements;

using Microsoft.AspNetCore.Authorization;

namespace EduTrack.Api.Authorization.Handlers;

/// <summary>
/// Handles resource ownership authorization.
/// This is a placeholder that should be extended with actual resource ownership logic.
/// </summary>
public class ResourceOwnerAuthorizationHandler : AuthorizationHandler<ResourceOwnerRequirement>
{
    private readonly ILogger<ResourceOwnerAuthorizationHandler> _logger;

    public ResourceOwnerAuthorizationHandler(ILogger<ResourceOwnerAuthorizationHandler> logger)
    {
        _logger = logger;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ResourceOwnerRequirement requirement)
    {
        // Get user ID from claims
        var userIdClaim = context.User.FindFirst(requirement.UserIdClaimType);
        if (userIdClaim == null)
        {
            _logger.LogWarning("User does not have user ID claim");
            context.Fail();
            return Task.CompletedTask;
        }

        // TODO: Implement actual resource ownership validation
        // This will be extended when specific resources are implemented
        // For now, we'll check if the context has a resource_owner claim
        var resourceOwnerClaim = context.User.FindFirst("resource_owner");
        if (resourceOwnerClaim?.Value == "true")
        {
            _logger.LogDebug("Resource ownership validated for user {UserId}", userIdClaim.Value);
            context.Succeed(requirement);
        }
        else
        {
            _logger.LogWarning("User {UserId} does not own the requested resource", userIdClaim.Value);
            context.Fail();
        }

        return Task.CompletedTask;
    }
}
