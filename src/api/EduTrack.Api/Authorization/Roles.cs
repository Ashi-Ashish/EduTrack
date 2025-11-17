namespace EduTrack.Api.Authorization;

/// <summary>
/// Defines the application role hierarchy for EduTrack.
/// Roles are assigned via JWT claims and enforced through authorization policies.
/// </summary>
public static class Roles
{
    /// <summary>
    /// Platform administrator with cross-tenant access.
    /// Used for system maintenance and support.
    /// </summary>
    public const string SuperAdmin = "SuperAdmin";

    /// <summary>
    /// Institute administrator with full access within their tenant.
    /// Can manage users, courses, institute settings, and staff members.
    /// Has built-in finance and attendance permissions.
    /// </summary>
    public const string InstituteAdmin = "InstituteAdmin";

    /// <summary>
    /// Institute manager with broad access within their tenant.
    /// Can manage courses, operations, and academic functions.
    /// Cannot create, modify, or delete staff members.
    /// </summary>
    public const string InstituteManager = "InstituteManager";

    /// <summary>
    /// Teaching staff with access to assigned classes and students.
    /// Can manage attendance, grades, and course materials.
    /// Can be granted additional permissions via claims (finance, etc.)
    /// </summary>
    public const string Teacher = "Teacher";

    /// <summary>
    /// Volunteer with limited access to assigned classes and students.
    /// Can view class information and assist with activities.
    /// Can be granted attendance permission via claims.
    /// </summary>
    public const string Volunteer = "Volunteer";

    /// <summary>
    /// Parent or guardian with access to linked student(s) data.
    /// Can view grades, attendance, and communicate with teachers.
    /// Access is restricted to explicitly linked students only.
    /// </summary>
    public const string Guardian = "Guardian";

    /// <summary>
    /// Student with limited access to their own data and enrolled courses.
    /// Can view grades, attendance, and submit assignments.
    /// </summary>
    public const string Student = "Student";

    // Role combinations for policy definitions
    public const string AdminRoles = $"{SuperAdmin},{InstituteAdmin}";
    public const string ManagementRoles = $"{SuperAdmin},{InstituteAdmin},{InstituteManager}";
    public const string AcademicStaff = $"{SuperAdmin},{InstituteAdmin},{InstituteManager},{Teacher},{Volunteer}";
    public const string StudentRelated = $"{Guardian},{Student}";
    public const string AllUsers = $"{SuperAdmin},{InstituteAdmin},{InstituteManager},{Teacher},{Volunteer},{Guardian},{Student}";
}
