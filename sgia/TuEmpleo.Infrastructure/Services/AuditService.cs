using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace TuEmpleo.Infrastructure.Services
{
    public interface IAuditService
    {
        string GetCurrentUserId();
        string GetCurrentUserName();
        DateTime GetCurrentDateTime();
    }

    public class AuditService : IAuditService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuditService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetCurrentUserId()
        {
            var userId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userId ?? "system";
        }

        public string GetCurrentUserName()
        {
            var userName = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Name)?.Value;
            return userName ?? "system";
        }

        public DateTime GetCurrentDateTime()
        {
            return DateTime.UtcNow;
        }
    }
}
