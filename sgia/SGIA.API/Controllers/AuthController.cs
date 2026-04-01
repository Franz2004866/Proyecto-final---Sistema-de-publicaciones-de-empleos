using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SGIA.Application.Common.Interfaces;

namespace SGIA.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ICurrentUserService _currentUserService;

        public AuthController(ICurrentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            return Ok(new
            {
                UserId = _currentUserService.GetUserId(),
                Username = _currentUserService.GetUsername(),
                Email = _currentUserService.GetEmail(),
                Roles = _currentUserService.GetRoles(),
                IsAdmin = _currentUserService.IsAdmin()
            });
        }

        [HttpGet("check-role/{role}")]
        [Authorize]
        public IActionResult CheckRole(string role)
        {
            return Ok(new
            {
                Role = role,
                HasRole = _currentUserService.IsInRole(role)
            });
        }
    }
}
