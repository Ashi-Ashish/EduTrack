using Microsoft.AspNetCore.Authorization;

namespace EduTrack.Api.Authorization.Requirements;

/// <summary>
/// Authorization requirement that validates a guardian has access to a specific student.
/// The guardian must have the student's ID in their 'guardian_of' claim.
/// </summary>
public class GuardianOfStudentRequirement : IAuthorizationRequirement
{
    /// <summary>
    /// The claim type that contains the list of student IDs the guardian has access to.
    /// </summary>
    public string GuardianOfClaimType { get; } = "guardian_of";

    /// <summary>
    /// The route parameter name containing the requested student ID.
    /// </summary>
    public string StudentIdRouteParameter { get; } = "studentId";
}
