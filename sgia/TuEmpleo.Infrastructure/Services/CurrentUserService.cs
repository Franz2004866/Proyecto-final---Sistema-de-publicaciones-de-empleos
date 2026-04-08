using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace TuEmpleo.Infrastructure.Services
{
    public interface ICurrentUserService
    {
        string? GetUserId();
        string? GetUsername();
        string? GetEmail();
        List<string> GetRoles();
        bool IsInRole(string role);
        bool IsAdmin();
        bool IsEmpresa();
        bool IsPostulante();
    }

    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? GetUserId()
        {
            return _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        public string? GetUsername()
        {
            return _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Name)?.Value;
        }

        public string? GetEmail()
        {
            return _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value;
        }

        public List<string> GetRoles()
        {
            return _httpContextAccessor.HttpContext?.User
                .FindAll(ClaimTypes.Role)
                .Select(c => c.Value)
                .ToList() ?? new List<string>();
        }

        public bool IsInRole(string role)
        {
            return _httpContextAccessor.HttpContext?.User.IsInRole(role) ?? false;
        }

        public bool IsAdmin()
        {
            return IsInRole("admin");
        }

        public bool IsEmpresa()
        {
            return IsInRole("empresa") || IsInRole("company");
        }

        public bool IsPostulante()
        {
            return IsInRole("postulante") || IsInRole("user");
        }
    }
}
