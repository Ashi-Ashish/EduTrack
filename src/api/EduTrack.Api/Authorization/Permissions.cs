using System.Security.Claims;

namespace EduTrack.Api.Authorization;

/// <summary>
/// Defines permission claims for fine-grained access control.
/// Permissions can be assigned to any role to grant additional capabilities.
/// 
/// NOTE: M1 uses coarse-grained permissions (finance, attendance, etc.)
/// M2 will introduce granular actions (finance:read, finance:write, etc.)
/// </summary>
public static class Permissions
{
    /// <summary>
    /// The claim type used for all permission claims.
    /// </summary>
    public const string ClaimType = "permission";

    /// <summary>
    /// Access to billing, invoices, payments, and financial reports.
    /// </summary>
    public const string Finance = "finance";

    /// <summary>
    /// Record and manage student attendance.
    /// Typically granted to Volunteers who need attendance recording capability.
    /// </summary>
    public const string Attendance = "attendance";

    /// <summary>
    /// Generate and view detailed reports.
    /// </summary>
    public const string Reports = "reports";

    /// <summary>
    /// Configure institute settings and preferences.
    /// </summary>
    public const string Settings = "settings";

    /// <summary>
    /// Helper method to create a permission claim.
    /// </summary>
    public static Claim CreateClaim(string permission)
    {
        return new Claim(ClaimType, permission);
    }

    /// <summary>
    /// Human-readable descriptions for UI display.
    /// </summary>
    public static class Descriptions
    {
        public const string FinanceDescription = "Access to billing, invoices, payments, and financial reports";
        public const string AttendanceDescription = "Record and manage student attendance";
        public const string ReportsDescription = "Generate and view detailed reports";
        public const string SettingsDescription = "Configure institute settings and preferences";
    }
}
