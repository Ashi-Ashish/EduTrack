using System.Net;
using System.Net.Http.Headers;

using EduTrack.Api.IntegrationTests.Helpers;

namespace EduTrack.Api.IntegrationTests.Authorization;

/// <summary>
/// Integration tests for tenant-based authorization.
/// Test naming convention: MethodName_Scenario_ExpectedBehavior
/// </summary>
public class TenantAuthorizationTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public TenantAuthorizationTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetTenantEndpoint_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/tenants/test-tenant/test");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetTenantEndpoint_WithMatchingTenantToken_ReturnsOk()
    {
        // Arrange
        var token = JwtTokenGenerator.GenerateInstituteAdminToken(tenantId: "tenant-123");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/tenants/tenant-123/test");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetTenantEndpoint_WithMismatchedTenantToken_ReturnsForbidden()
    {
        // Arrange - User has tenant-123 but tries to access tenant-456
        var token = JwtTokenGenerator.GenerateInstituteAdminToken(tenantId: "tenant-123");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/tenants/tenant-456/test");

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetTenantEndpoint_WithSuperAdminToken_ReturnsOk()
    {
        // Arrange - SuperAdmin bypasses tenant checks
        var token = JwtTokenGenerator.GenerateSuperAdminToken();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/tenants/any-tenant/test");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetTenantEndpoint_WithTeacherMatchingTenant_ReturnsOk()
    {
        // Arrange - Teacher from tenant-123
        var token = JwtTokenGenerator.GenerateTeacherToken(tenantId: "tenant-123");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/tenants/tenant-123/test");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetTenantEndpoint_WithTeacherMismatchedTenant_ReturnsForbidden()
    {
        // Arrange - Teacher from tenant-123 tries to access tenant-456
        var token = JwtTokenGenerator.GenerateTeacherToken(tenantId: "tenant-123");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.GetAsync("/api/tenants/tenant-456/test");

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
