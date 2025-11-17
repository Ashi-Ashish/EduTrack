using System.Net;
using System.Net.Http.Headers;

using EduTrack.Api.IntegrationTests.Helpers;

namespace EduTrack.Api.IntegrationTests.Authorization;

/// <summary>
/// Integration tests for role-based authorization policies.
/// Test naming convention: MethodName_Scenario_ExpectedBehavior
/// </summary>
public class RolePolicyTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public RolePolicyTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetSuperAdminEndpoint_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/test/superadmin");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetTeacherEndpoint_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/test/teacher");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetInstituteManagerEndpoint_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/test/manager");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetVolunteerEndpoint_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/test/volunteer");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetGuardianEndpoint_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/test/guardian");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetStudentEndpoint_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/test/student");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetFinanceEndpoint_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/test/finance");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task PostStaffManagement_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.PostAsync("/api/test/staff", null);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // Tests with valid tokens
    [Fact]
    public async Task GetSuperAdminEndpoint_WithSuperAdminToken_ReturnsOk()
    {
        // Arrange
        var token = JwtTokenGenerator.GenerateSuperAdminToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/test/superadmin");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetSuperAdminEndpoint_WithTeacherToken_ReturnsForbidden()
    {
        // Arrange
        var token = JwtTokenGenerator.GenerateTeacherToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/test/superadmin");

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetTeacherEndpoint_WithTeacherToken_ReturnsOk()
    {
        // Arrange
        var token = JwtTokenGenerator.GenerateTeacherToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/test/teacher");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetTeacherEndpoint_WithStudentToken_ReturnsForbidden()
    {
        // Arrange
        var token = JwtTokenGenerator.GenerateStudentToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/test/teacher");

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetInstituteManagerEndpoint_WithManagerToken_ReturnsOk()
    {
        // Arrange
        var token = JwtTokenGenerator.GenerateInstituteManagerToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/test/manager");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetVolunteerEndpoint_WithVolunteerToken_ReturnsOk()
    {
        // Arrange
        var token = JwtTokenGenerator.GenerateVolunteerToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/test/volunteer");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetGuardianEndpoint_WithGuardianToken_ReturnsOk()
    {
        // Arrange
        var token = JwtTokenGenerator.GenerateGuardianToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/test/guardian");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetStudentEndpoint_WithStudentToken_ReturnsOk()
    {
        // Arrange
        var token = JwtTokenGenerator.GenerateStudentToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/test/student");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetFinanceEndpoint_WithAdminToken_ReturnsOk()
    {
        // Arrange - InstituteAdmin has built-in finance access
        var token = JwtTokenGenerator.GenerateInstituteAdminToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/test/finance");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetFinanceEndpoint_WithTeacherWithFinancePermission_ReturnsOk()
    {
        // Arrange - Teacher with finance permission claim
        var token = JwtTokenGenerator.GenerateTeacherToken(permissions: ["finance"]);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/test/finance");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetFinanceEndpoint_WithTeacherWithoutFinancePermission_ReturnsForbidden()
    {
        // Arrange - Teacher without finance permission
        var token = JwtTokenGenerator.GenerateTeacherToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/test/finance");

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task PostStaffManagement_WithInstituteAdminToken_ReturnsOk()
    {
        // Arrange - Only InstituteAdmin can manage staff
        var token = JwtTokenGenerator.GenerateInstituteAdminToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.PostAsync("/api/test/staff", null);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task PostStaffManagement_WithInstituteManagerToken_ReturnsForbidden()
    {
        // Arrange - InstituteManager cannot manage staff
        var token = JwtTokenGenerator.GenerateInstituteManagerToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.PostAsync("/api/test/staff", null);

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task PostStaffManagement_WithSuperAdminToken_ReturnsOk()
    {
        // Arrange - SuperAdmin can manage staff
        var token = JwtTokenGenerator.GenerateSuperAdminToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.PostAsync("/api/test/staff", null);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
