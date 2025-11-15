using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Configure Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var authConfig = builder.Configuration.GetSection("Authentication:Schemes:Bearer");

    options.Authority = authConfig["Authority"];
    options.Audience = authConfig["Audience"];
    options.RequireHttpsMetadata = authConfig.GetValue("RequireHttpsMetadata", true);
    options.SaveToken = authConfig.GetValue("SaveToken", false);

    var validationParams = authConfig.GetSection("TokenValidationParameters");
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = validationParams.GetValue("ValidateIssuer", true),
        ValidateAudience = validationParams.GetValue("ValidateAudience", true),
        ValidateLifetime = validationParams.GetValue("ValidateLifetime", true),
        ValidateIssuerSigningKey = validationParams.GetValue("ValidateIssuerSigningKey", true),
        RoleClaimType = validationParams["RoleClaimType"] ?? "roles",
        ClockSkew = TimeSpan.Parse(validationParams["ClockSkew"] ?? "00:05:00")
    };

    // Add event handlers for debugging
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            var logger = context.HttpContext.RequestServices
                .GetRequiredService<ILogger<Program>>();
            logger.LogError(context.Exception, "Authentication failed");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            var logger = context.HttpContext.RequestServices
                .GetRequiredService<ILogger<Program>>();
            logger.LogDebug("Token validated for {User}",
                context.Principal?.Identity?.Name ?? "Unknown");
            return Task.CompletedTask;
        }
    };
});

// Configure Authorization
builder.Services.AddAuthorization();

var app = builder.Build();

// Middleware order is critical!
app.UseAuthentication();
app.UseAuthorization();

// Public health endpoint
app.MapGet("/health", () => Results.Ok(new { status = "ok" }))
    .WithName("Health");

// Protected test endpoint
app.MapGet("/api/auth/test", (HttpContext context) =>
{
    var user = context.User;
    var claims = user.Claims.Select(c => new { c.Type, c.Value });

    return Results.Ok(new
    {
        authenticated = user.Identity?.IsAuthenticated ?? false,
        name = user.Identity?.Name,
        roles = user.FindAll("roles").Select(c => c.Value),
        claims
    });
})
.RequireAuthorization()
.WithName("AuthTest");

app.Run();

// Make the implicit Program class accessible to tests
// This is a standard ASP.NET Core pattern for integration testing
// See: https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests
public partial class Program { }
