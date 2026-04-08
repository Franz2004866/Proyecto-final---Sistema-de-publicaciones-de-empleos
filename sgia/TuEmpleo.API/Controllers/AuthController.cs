using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Json;
using TuEmpleo.Infrastructure.Repositories;
using TuEmpleo.Domain.Entities;
using TuEmpleo.Infrastructure.Services;

namespace TuEmpleo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IAuditService _auditService;

        public AuthController(
            IConfiguration configuration,
            IHttpClientFactory httpClientFactory,
            IUsuarioRepository usuarioRepository,
            ICurrentUserService currentUserService,
            IAuditService auditService)
        {
            _configuration = configuration;
            _httpClient = httpClientFactory.CreateClient();
            _usuarioRepository = usuarioRepository;
            _currentUserService = currentUserService;
            _auditService = auditService;
        }

        [HttpGet("health")]
        public ActionResult Health()
        {
            return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult> GetCurrentUser()
        {
            var email = _currentUserService.GetEmail();
            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var usuario = await _usuarioRepository.GetByEmailAsync(email);
            if (usuario == null)
            {
                var username = _currentUserService.GetUsername();
                var roles = _currentUserService.GetRoles();
                
                var tipoRol = TipoRol.Postulante;
                if (roles.Contains("empresa"))
                    tipoRol = TipoRol.Empresa;
                else if (roles.Contains("admin"))
                    tipoRol = TipoRol.Administrador;

                usuario = new Usuario
                {
                    Nombre = username ?? email.Split('@')[0],
                    Apellido = "",
                    Email = email,
                    Telefono = "",
                    Rol = tipoRol,
                    Activo = true,
                    FechaCreacion = _auditService.GetCurrentDateTime(),
                    CreadoPor = "system"
                };

                await _usuarioRepository.AddAsync(usuario);
            }

            return Ok(new
            {
                id = usuario.Id,
                nombre = usuario.Nombre,
                apellido = usuario.Apellido,
                email = usuario.Email,
                rol = usuario.Rol.ToString()
            });
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var keycloakUrl = _configuration["Keycloak:Authority"] ?? "http://keycloak:8080/realms/tuempleo-realm";
                var adminToken = await GetAdminTokenAsync(keycloakUrl);
                
                var userPayload = new
                {
                    username = request.Username,
                    email = request.Email,
                    firstName = request.FirstName,
                    lastName = request.LastName,
                    enabled = true,
                    emailVerified = true,
                    credentials = new[]
                    {
                        new
                        {
                            type = "password",
                            value = request.Password,
                            temporary = false
                        }
                    }
                };

                var createUserResponse = await _httpClient.PostAsJsonAsync(
                    $"{keycloakUrl}/admin/realms/tuempleo-realm/users",
                    userPayload
                );

                if (!createUserResponse.IsSuccessStatusCode)
                {
                    var errorContent = await createUserResponse.Content.ReadAsStringAsync();
                    return BadRequest(new { message = "Error al crear usuario en Keycloak", details = errorContent });
                }

                var locationHeader = createUserResponse.Headers.Location?.ToString();
                if (string.IsNullOrEmpty(locationHeader))
                {
                    var usersResponse = await _httpClient.GetAsync($"{keycloakUrl}/admin/realms/tuempleo-realm/users?username={request.Username}");
                    var users = await usersResponse.Content.ReadFromJsonAsync<List<KeycloakUser>>();
                    var user = users?.FirstOrDefault();

                    if (user != null)
                    {
                        await AssignRoleToUserAsync(keycloakUrl, adminToken, user.id, "postulante");
                    }
                }
                else
                {
                    var userId = locationHeader.Split('/').Last();
                    await AssignRoleToUserAsync(keycloakUrl, adminToken, userId, "postulante");
                }

                return Ok(new { message = "Usuario registrado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno del servidor", details = ex.Message });
            }
        }

        private async Task<string> GetAdminTokenAsync(string keycloakUrl)
        {
            var tokenUrl = $"{keycloakUrl.Replace("/realms/tuempleo-realm", "")}/realms/master/protocol/openid-connect/token";
            
            var tokenRequest = new Dictionary<string, string>
            {
                {"username", "admin"},
                {"password", "admin"},
                {"grant_type", "password"},
                {"client_id", "admin-cli"}
            };

            var tokenResponse = await _httpClient.PostAsJsonAsync(tokenUrl, tokenRequest);
            var tokenResult = await tokenResponse.Content.ReadFromJsonAsync<TokenResponse>();
            
            return tokenResult?.access_token ?? throw new Exception("No se pudo obtener el token de admin");
        }

        private async Task AssignRoleToUserAsync(string keycloakUrl, string adminToken, string userId, string roleName)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", adminToken);
            
            var rolePayload = new[] { new { name = roleName } };
            
            await _httpClient.PostAsJsonAsync(
                $"{keycloakUrl}/admin/realms/tuempleo-realm/users/{userId}/role-mappings/realm",
                rolePayload
            );
        }
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
    }

    public class TokenResponse
    {
        public string access_token { get; set; } = "";
    }

    public class KeycloakUser
    {
        public string id { get; set; } = "";
        public string username { get; set; } = "";
    }
}