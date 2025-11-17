namespace EduTrack.Api.Authorization;

/// <summary>
/// Defines authorization policy names for consistent policy enforcement.
/// </summary>
public static class Policies
{
    // Simple role-based policies
    public const string RequireSuperAdmin = "RequireSuperAdmin";
    public const string RequireInstituteAdmin = "RequireInstituteAdmin";
    public const string RequireInstituteManager = "RequireInstituteManager";
    public const string RequireTeacher = "RequireTeacher";
    public const string RequireVolunteer = "RequireVolunteer";
    public const string RequireGuardian = "RequireGuardian";
    public const string RequireStudent = "RequireStudent";

    // Combined role policies
    public const string RequireAnyAdmin = "RequireAnyAdmin";
    public const string RequireManagement = "RequireManagement";
    public const string RequireAcademicStaff = "RequireAcademicStaff";
    public const string RequireStudentOrGuardian = "RequireStudentOrGuardian";

    // Permission-based policies (claim-based)
    public const string RequireFinancePermission = "RequireFinancePermission";
    public const string RequireAttendancePermission = "RequireAttendancePermission";
    public const string RequireReportsPermission = "RequireReportsPermission";
    public const string RequireSettingsPermission = "RequireSettingsPermission";

    // Special restricted policies
    public const string RequireStaffManagement = "RequireStaffManagement"; // InstituteAdmin only

    // Custom requirement policies
    public const string RequireTenantAccess = "RequireTenantAccess";
    public const string RequireResourceOwner = "RequireResourceOwner";
    public const string RequireGuardianOfStudent = "RequireGuardianOfStudent";
    public const string RequireInstituteAdminOrOwner = "RequireInstituteAdminOrOwner";
}
