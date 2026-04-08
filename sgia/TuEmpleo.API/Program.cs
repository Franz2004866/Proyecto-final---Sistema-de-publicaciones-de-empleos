using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text.Json.Serialization;
using AutoMapper;
using TuEmpleo.Application.Mapping;
using TuEmpleo.Infrastructure.Data;
using TuEmpleo.Infrastructure.Repositories;
using TuEmpleo.Infrastructure.Services;
using TuEmpleo.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IEmpleoRepository, EmpleoRepository>();
builder.Services.AddScoped<IPostulacionRepository, PostulacionRepository>();
builder.Services.AddScoped<ICategoriaEmpleoRepository, CategoriaEmpleoRepository>();
builder.Services.AddScoped<IMovimientoPostulacionRepository, MovimientoPostulacionRepository>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IDatabaseSeeder, DatabaseSeeder>();

builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

var keycloakBaseUrl = builder.Configuration["Keycloak:Authority"]?.Replace("/realms/tuempleo-realm", "") ?? "http://keycloak:8080";
var keycloakRealm = "tuempleo-realm";
var jwksUrl = $"{keycloakBaseUrl}/realms/{keycloakRealm}/protocol/openid-connect/certs";

SecurityKey? securityKey = null;
var maxRetries = 5;
var retryDelay = 3;

for (int i = 0; i < maxRetries; i++)
{
    try
    {
        Console.WriteLine($"[JWT] Intento {i + 1}/{maxRetries} de conectar a Keycloak...");
        
        var httpClient = new HttpClient();
        httpClient.Timeout = TimeSpan.FromSeconds(10);
        
        var jwksResponse = await httpClient.GetFromJsonAsync<JsonWebKeySet>(jwksUrl);
        
        if (jwksResponse?.Keys?.Any() == true)
        {
            var rsaKey = jwksResponse.Keys.First();
            var rsaParams = new RSAParameters
            {
                Modulus = Base64UrlEncoder.DecodeBytes(rsaKey.N),
                Exponent = Base64UrlEncoder.DecodeBytes(rsaKey.E)
            };
            var rsa = RSA.Create();
            rsa.ImportParameters(rsaParams);
            
            securityKey = new RsaSecurityKey(rsa) { KeyId = rsaKey.Kid };
            Console.WriteLine($"[JWT] Clave RSA cargada dinámicamente desde Keycloak. KeyId: {rsaKey.Kid}");
            break;
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[JWT] Intento {i + 1} falló: {ex.Message}");
        if (i < maxRetries - 1)
        {
            Console.WriteLine($"[JWT] Esperando {retryDelay} segundos antes de reintentar...");
            await Task.Delay(TimeSpan.FromSeconds(retryDelay));
        }
    }
}

if (securityKey == null)
{
    throw new Exception("[JWT] No se pudo obtener la clave desde Keycloak después de varios intentos. La aplicación no puede iniciar sin autenticación configurada.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Audience = builder.Configuration["Keycloak:Audience"];
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = securityKey
        };
        
        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                var identity = context.Principal?.Identity as System.Security.Claims.ClaimsIdentity;
                var claims = context.Principal?.Claims;
                
                if (identity != null && claims != null)
                {
                    var emailClaim = claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;
                    if (!string.IsNullOrEmpty(emailClaim))
                    {
                        identity.AddClaim(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, emailClaim));
                    }
                    
                    var realmAccessClaim = claims.FirstOrDefault(c => c.Type == "realm_access");
                    if (realmAccessClaim != null && !string.IsNullOrEmpty(realmAccessClaim.Value))
                    {
                        try
                        {
                            var realmAccessJson = System.Text.Json.JsonDocument.Parse(realmAccessClaim.Value);
                            if (realmAccessJson.RootElement.TryGetProperty("roles", out var rolesElement))
                            {
                                foreach (var role in rolesElement.EnumerateArray())
                                {
                                    var roleValue = role.GetString();
                                    if (!string.IsNullOrEmpty(roleValue))
                                    {
                                        identity.AddClaim(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, roleValue));
                                    }
                                }
                            }
                        }
                        catch { }
                    }
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
    
    options.AddPolicy("EmpresaOnly", policy => policy.RequireRole("empresa", "company"));
    
    options.AddPolicy("PostulanteOnly", policy => policy.RequireRole("postulante"));
    
    options.AddPolicy("EmpresaOrAdmin", policy => policy.RequireRole("empresa", "company", "admin"));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200", "http://localhost:42000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();

app.UseAuditMiddleware();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    await dbContext.Database.EnsureCreatedAsync();
    
    var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();
    if (!await seeder.HasSeededAsync())
    {
        await seeder.SeedAsync();
    }
}

app.Run();
