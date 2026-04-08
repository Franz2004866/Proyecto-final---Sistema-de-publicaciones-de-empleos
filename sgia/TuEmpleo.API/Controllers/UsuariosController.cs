using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using TuEmpleo.Application.DTOs;
using TuEmpleo.Domain.Entities;
using TuEmpleo.Infrastructure.Repositories;
using TuEmpleo.Infrastructure.Services;

namespace TuEmpleo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IMapper _mapper;
        private readonly IAuditService _auditService;
        private readonly ICurrentUserService _currentUserService;

        public UsuariosController(
            IUsuarioRepository usuarioRepository,
            IMapper mapper,
            IAuditService auditService,
            ICurrentUserService currentUserService)
        {
            _usuarioRepository = usuarioRepository;
            _mapper = mapper;
            _auditService = auditService;
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<IEnumerable<UsuarioDto>>> GetAll()
        {
            var usuarios = await _usuarioRepository.GetAllAsync();
            return Ok(_mapper.Map<IEnumerable<UsuarioDto>>(usuarios));
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<UsuarioDto>> GetById(int id)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(id);
            if (usuario == null)
                return NotFound();

            return Ok(_mapper.Map<UsuarioDto>(usuario));
        }

        [HttpGet("by-keycloak/{keycloakId}")]
        public async Task<ActionResult<UsuarioDto>> GetByKeycloakId(Guid keycloakId)
        {
            var usuario = await _usuarioRepository.GetByKeycloakIdAsync(keycloakId);
            if (usuario == null)
                return NotFound();

            return Ok(_mapper.Map<UsuarioDto>(usuario));
        }

        [HttpGet("rol/{rol}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<IEnumerable<UsuarioDto>>> GetByRol(TipoRol rol)
        {
            var usuarios = await _usuarioRepository.GetByRolAsync(rol);
            return Ok(_mapper.Map<IEnumerable<UsuarioDto>>(usuarios));
        }

        [HttpPost]
        public async Task<ActionResult<UsuarioDto>> Create([FromBody] CrearUsuarioDto dto)
        {
            var existente = await _usuarioRepository.GetByEmailAsync(dto.Email);
            if (existente != null)
                return BadRequest("Ya existe un usuario con este email");

            var usuario = _mapper.Map<Usuario>(dto);
            usuario.FechaCreacion = _auditService.GetCurrentDateTime();
            usuario.CreadoPor = _auditService.GetCurrentUserName();
            usuario.Activo = true;

            await _usuarioRepository.AddAsync(usuario);
            return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, _mapper.Map<UsuarioDto>(usuario));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<UsuarioDto>> Update(int id, [FromBody] ActualizarUsuarioDto dto)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(id);
            if (usuario == null)
                return NotFound();

            _mapper.Map(dto, usuario);
            usuario.FechaActualizacion = _auditService.GetCurrentDateTime();
            usuario.ActualizadoPor = _auditService.GetCurrentUserName();

            await _usuarioRepository.UpdateAsync(usuario);
            return Ok(_mapper.Map<UsuarioDto>(usuario));
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> Delete(int id)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(id);
            if (usuario == null)
                return NotFound();

            usuario.Activo = false;
            usuario.FechaActualizacion = _auditService.GetCurrentDateTime();
            usuario.ActualizadoPor = _auditService.GetCurrentUserName();

            await _usuarioRepository.UpdateAsync(usuario);
            return NoContent();
        }
    }
}
