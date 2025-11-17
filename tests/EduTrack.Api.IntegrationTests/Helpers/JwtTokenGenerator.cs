using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.IdentityModel.Tokens;

namespace EduTrack.Api.IntegrationTests.Helpers;

/// <summary>
/// Helper class to generate JWT tokens for integration testing.
/// Generates tokens with configurable roles, permissions, and claims.
/// </summary>
public static class JwtTokenGenerator
{
    // Match the settings from appsettings.json
    private const string Issuer = "https://edutrack-test-issuer.local";
    private const string Audience = "edutrack-api";
    private const string SecretKey = "your-super-secret-key-that-is-at-least-32-characters-long-for-testing";

    /// <summary>
    /// Generates a JWT token with specified claims.
    /// </summary>
    public static string GenerateToken(
        string userId,
        string? role = null,
        string? tenantId = null,
        IEnumerable<string>? permissions = null,
        IEnumerable<string>? guardianOfStudents = null,
        bool isResourceOwner = false,
        int expirationMinutes = 30)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString())
        };

        // Add role claim if provided
        if (!string.IsNullOrEmpty(role))
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        // Add tenant_id claim if provided
        if (!string.IsNullOrEmpty(tenantId))
        {
            claims.Add(new Claim("tenant_id", tenantId));
        }

        // Add permission claims if provided
        if (permissions != null)
        {
            foreach (var permission in permissions)
            {
                claims.Add(new Claim("permission", permission));
            }
        }

        // Add guardian_of claims if provided (can have multiple students)
        if (guardianOfStudents != null)
        {
            foreach (var studentId in guardianOfStudents)
            {
                claims.Add(new Claim("guardian_of", studentId));
            }
        }

        // Add resource_owner claim if specified
        if (isResourceOwner)
        {
            claims.Add(new Claim("resource_owner", "true"));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: Issuer,
            audience: Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>
    /// Generates a token for SuperAdmin role.
    /// </summary>
    public static string GenerateSuperAdminToken(string userId = "superadmin-user-id")
    {
        return GenerateToken(userId, role: "SuperAdmin");
    }

    /// <summary>
    /// Generates a token for InstituteAdmin role with tenant.
    /// </summary>
    public static string GenerateInstituteAdminToken(
        string userId = "admin-user-id",
        string tenantId = "tenant-123")
    {
        return GenerateToken(userId, role: "InstituteAdmin", tenantId: tenantId);
    }

    /// <summary>
    /// Generates a token for InstituteManager role with tenant.
    /// </summary>
    public static string GenerateInstituteManagerToken(
        string userId = "manager-user-id",
        string tenantId = "tenant-123")
    {
        return GenerateToken(userId, role: "InstituteManager", tenantId: tenantId);
    }

    /// <summary>
    /// Generates a token for Teacher role with tenant.
    /// </summary>
    public static string GenerateTeacherToken(
        string userId = "teacher-user-id",
        string tenantId = "tenant-123",
        IEnumerable<string>? permissions = null)
    {
        return GenerateToken(userId, role: "Teacher", tenantId: tenantId, permissions: permissions);
    }

    /// <summary>
    /// Generates a token for Volunteer role with tenant.
    /// </summary>
    public static string GenerateVolunteerToken(
        string userId = "volunteer-user-id",
        string tenantId = "tenant-123",
        IEnumerable<string>? permissions = null)
    {
        return GenerateToken(userId, role: "Volunteer", tenantId: tenantId, permissions: permissions);
    }

    /// <summary>
    /// Generates a token for Guardian role with tenant and linked students.
    /// </summary>
    public static string GenerateGuardianToken(
        string userId = "guardian-user-id",
        string tenantId = "tenant-123",
        IEnumerable<string>? guardianOfStudents = null)
    {
        return GenerateToken(userId, role: "Guardian", tenantId: tenantId, guardianOfStudents: guardianOfStudents);
    }

    /// <summary>
    /// Generates a token for Student role with tenant.
    /// </summary>
    public static string GenerateStudentToken(
        string userId = "student-user-id",
        string tenantId = "tenant-123")
    {
        return GenerateToken(userId, role: "Student", tenantId: tenantId);
    }
}
