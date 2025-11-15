using System.Net;
using System.Net.Http.Headers;

using Microsoft.AspNetCore.Mvc.Testing;

namespace EduTrack.Api.IntegrationTests.Authorization;

/// <summary>
/// Integration tests for API authentication and authorization.
/// Test naming convention: MethodName_Scenario_ExpectedBehavior
/// This follows the Roy Osherove naming convention, which is an industry standard.
/// </summary>
public class AuthenticationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public AuthenticationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetHealth_WhenCalled_ReturnsOkWithHealthyStatus()
    {
        // Act
        var response = await _client.GetAsync("/health");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("ok", content);
    }

    [Fact]
    public async Task GetAuthTest_WhenNoTokenProvided_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/auth/test");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetAuthTest_WhenInvalidTokenProvided_ReturnsUnauthorized()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", "invalid-token-12345");

        // Act
        var response = await _client.GetAsync("/api/auth/test");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetAuthTest_WhenMalformedTokenProvided_ReturnsUnauthorized()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", "not.a.jwt");

        // Act
        var response = await _client.GetAsync("/api/auth/test");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetHealth_WhenCalled_ReturnsJsonContentType()
    {
        // Act
        var response = await _client.GetAsync("/health");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(response.Content.Headers.ContentType);
        Assert.Equal("application/json", response.Content.Headers.ContentType.MediaType);
    }
}
