using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace EduTrack.Api.IntegrationTests;

/// <summary>
/// Custom WebApplicationFactory for integration testing.
/// Configures the test server to use symmetric key JWT validation instead of Entra ID.
/// </summary>
public class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    // Must match the secret key in JwtTokenGenerator
    private const string SecretKey = "your-super-secret-key-that-is-at-least-32-characters-long-for-testing";
    private const string Issuer = "https://edutrack-test-issuer.local";
    private const string Audience = "edutrack-api";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Override configuration to disable Entra ID auth
        _ = builder.ConfigureAppConfiguration((context, config) =>
        {
            _ = config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Authentication:Schemes:Bearer:Authority"] = string.Empty,
                ["Authentication:Schemes:Bearer:TokenValidationParameters:ValidateIssuerSigningKey"] = "false"
            });
        });

        _ = builder.ConfigureTestServices(services =>
        {
            // PostConfigure JWT Bearer to override with test settings
            _ = services.PostConfigure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                // Override all validation parameters for testing
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Issuer,
                    ValidAudience = Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey)),
                    ClockSkew = TimeSpan.FromMinutes(5),
                    RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                };

                // Disable HTTPS and OIDC discovery for testing
                options.RequireHttpsMetadata = false;
                options.Authority = null!;
                options.MetadataAddress = null!;
                options.Configuration = null!;
                options.ConfigurationManager = null!;
            });
        });
    }
}
