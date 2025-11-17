using System.Net;
using System.Net.Http.Headers;

using EduTrack.Api.IntegrationTests.Helpers;

namespace EduTrack.Api.IntegrationTests.Authorization;

/// <summary>
/// Integration tests for guardian-student relationship authorization.
/// Test naming convention: MethodName_Scenario_ExpectedBehavior
/// </summary>
public class GuardianAuthorizationTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public GuardianAuthorizationTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetGuardianAccessEndpoint_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/students/test-student/guardian-access");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetGuardianAccessEndpoint_WithGuardianLinkedToStudent_ReturnsOk()
    {
        // Arrange - Guardian linked to student-123
        var token = JwtTokenGenerator.GenerateGuardianToken(
            guardianOfStudents: ["student-123"]);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/students/student-123/guardian-access");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetGuardianAccessEndpoint_WithGuardianNotLinkedToStudent_ReturnsForbidden()
    {
        // Arrange - Guardian linked to student-123 but tries to access student-456
        var token = JwtTokenGenerator.GenerateGuardianToken(
            guardianOfStudents: ["student-123"]);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/students/student-456/guardian-access");

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetGuardianAccessEndpoint_WithGuardianLinkedToMultipleStudents_ReturnsOk()
    {
        // Arrange - Guardian linked to multiple students (siblings)
        var token = JwtTokenGenerator.GenerateGuardianToken(
            guardianOfStudents: ["student-123", "student-456", "student-789"]);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act - Access second student
        var response = await _client.GetAsync("/api/students/student-456/guardian-access");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetGuardianAccessEndpoint_WithInstituteAdminToken_ReturnsOk()
    {
        // Arrange - InstituteAdmin bypasses guardian checks
        var token = JwtTokenGenerator.GenerateInstituteAdminToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/students/any-student/guardian-access");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetGuardianAccessEndpoint_WithSuperAdminToken_ReturnsOk()
    {
        // Arrange - SuperAdmin bypasses guardian checks
        var token = JwtTokenGenerator.GenerateSuperAdminToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/students/any-student/guardian-access");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetGuardianAccessEndpoint_WithTeacherToken_ReturnsForbidden()
    {
        // Arrange - Teacher doesn't have guardian_of claim
        var token = JwtTokenGenerator.GenerateTeacherToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/students/student-123/guardian-access");

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
