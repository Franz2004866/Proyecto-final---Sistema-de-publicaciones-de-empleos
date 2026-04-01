using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http.Json;
using System.Security.Cryptography;
using SGIA.Application.Common.Interfaces;
using SGIA.Application.Mapping;
using SGIA.Domain.Entities;
using SGIA.Infrastructure.Data;
using SGIA.Infrastructure.Repositories;
using SGIA.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpContextAccessor();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IMovementRepository, MovementRepository>();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IDatabaseSeeder, DatabaseSeeder>();

builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

var keycloakBaseUrl = builder.Configuration["Keycloak:Authority"]?.Replace("/realms/sgia-realm", "") ?? "http://keycloak:8080";
var keycloakRealm = "sgia-realm";
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
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
    options.AddPolicy("AdminOrOperario", policy => policy.RequireRole("admin", "operario"));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:42000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
    
    var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();
    if (!await seeder.HasSeededAsync())
    {
        await seeder.SeedAsync();
    }
}

app.Run();
