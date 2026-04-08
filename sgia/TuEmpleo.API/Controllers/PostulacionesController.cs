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
    public class PostulacionesController : ControllerBase
    {
        private readonly IPostulacionRepository _postulacionRepository;
        private readonly IEmpleoRepository _empleoRepository;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IMovimientoPostulacionRepository _movimientoRepository;
        private readonly IMapper _mapper;
        private readonly IAuditService _auditService;
        private readonly ICurrentUserService _currentUserService;

        public PostulacionesController(
            IPostulacionRepository postulacionRepository,
            IEmpleoRepository empleoRepository,
            IUsuarioRepository usuarioRepository,
            IMovimientoPostulacionRepository movimientoRepository,
            IMapper mapper,
            IAuditService auditService,
            ICurrentUserService currentUserService)
        {
            _postulacionRepository = postulacionRepository;
            _empleoRepository = empleoRepository;
            _usuarioRepository = usuarioRepository;
            _movimientoRepository = movimientoRepository;
            _mapper = mapper;
            _auditService = auditService;
            _currentUserService = currentUserService;
        }

        [HttpGet]
        [Authorize(Policy = "EmpresaOrAdmin")]
        public async Task<ActionResult<IEnumerable<PostulacionDto>>> GetAll([FromQuery] PostulacionFiltroDto filtro)
        {
            var postulaciones = await _postulacionRepository.GetFilteredAsync(filtro);
            return Ok(_mapper.Map<IEnumerable<PostulacionDto>>(postulaciones));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PostulacionDto>> GetById(int id)
        {
            var postulacion = await _postulacionRepository.GetWithDetailsAsync(id);
            if (postulacion == null)
                return NotFound();

            return Ok(_mapper.Map<PostulacionDto>(postulacion));
        }

        [HttpGet("empleo/{empleoId}")]
        [Authorize(Policy = "EmpresaOrAdmin")]
        public async Task<ActionResult<IEnumerable<PostulacionDto>>> GetByEmpleo(int empleoId)
        {
            var postulaciones = await _postulacionRepository.GetByEmpleoAsync(empleoId);
            return Ok(_mapper.Map<IEnumerable<PostulacionDto>>(postulaciones));
        }

        [HttpGet("mis-postulaciones")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<PostulacionDto>>> GetMyPostulaciones()
        {
            var email = _currentUserService.GetEmail();
            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var usuario = await _usuarioRepository.GetByEmailAsync(email);
            if (usuario == null)
                return NotFound("Usuario no encontrado");

            var postulaciones = await _postulacionRepository.GetByPostulanteAsync(usuario.Id);
            return Ok(_mapper.Map<IEnumerable<PostulacionDto>>(postulaciones));
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PostulacionDto>> Create([FromBody] CrearPostulacionDto dto)
        {
            var email = _currentUserService.GetEmail();
            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var postulante = await _usuarioRepository.GetByEmailAsync(email);
            if (postulante == null)
                return BadRequest("No se encontró el postulante asociado");

            var empleo = await _empleoRepository.GetByIdAsync(dto.EmpleoId);
            if (empleo == null)
                return BadRequest("Empleo no encontrado");

            if (!empleo.VacantesDisponibles)
                return BadRequest("Este empleo ya no tiene vacantes disponibles");

            var existe = await _postulacionRepository.ExistsPostulacionAsync(dto.EmpleoId, postulante.Id);
            if (existe)
                return BadRequest("Ya te has postulado a este empleo");

            var postulacion = _mapper.Map<Postulacion>(dto);
            postulacion.PostulanteId = postulante.Id;
            postulacion.FechaPostulacion = _auditService.GetCurrentDateTime();
            postulacion.FechaCreacion = _auditService.GetCurrentDateTime();
            postulacion.CreadoPor = _auditService.GetCurrentUserName();
            postulacion.Activo = true;
            postulacion.Estado = EstadoPostulacion.Pendiente;

            await _postulacionRepository.AddAsync(postulacion);
            
            var movimiento = new MovimientoPostulacion
            {
                PostulacionId = postulacion.Id,
                TipoMovimiento = "CREACION",
                EstadoAnterior = "",
                EstadoNuevo = EstadoPostulacion.Pendiente.ToString(),
                Observacion = "Postulación creada",
                UsuarioResponsable = _currentUserService.GetUsername() ?? "Sistema",
                FechaCreacion = _auditService.GetCurrentDateTime(),
                CreadoPor = _currentUserService.GetUsername() ?? "Sistema"
            };
            await _movimientoRepository.AddAsync(movimiento);
            
            return CreatedAtAction(nameof(GetById), new { id = postulacion.Id }, _mapper.Map<PostulacionDto>(postulacion));
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "EmpresaOrAdmin")]
        public async Task<ActionResult<PostulacionDto>> Update(int id, [FromBody] ActualizarPostulacionDto dto)
        {
            var postulacion = await _postulacionRepository.GetByIdAsync(id);
            if (postulacion == null)
                return NotFound();

            var estadoAnterior = postulacion.Estado.ToString();
            postulacion.Estado = dto.Estado;
            postulacion.Notas = dto.Notas;
            postulacion.FechaRevision = _auditService.GetCurrentDateTime();
            postulacion.FechaActualizacion = _auditService.GetCurrentDateTime();
            postulacion.ActualizadoPor = _auditService.GetCurrentUserName();

            await _postulacionRepository.UpdateAsync(postulacion);
            
            var movimiento = new MovimientoPostulacion
            {
                PostulacionId = postulacion.Id,
                TipoMovimiento = "CAMBIO_ESTADO",
                EstadoAnterior = estadoAnterior,
                EstadoNuevo = dto.Estado.ToString(),
                Observacion = dto.Notas,
                UsuarioResponsable = _currentUserService.GetUsername() ?? "Sistema",
                FechaCreacion = _auditService.GetCurrentDateTime(),
                CreadoPor = _currentUserService.GetUsername() ?? "Sistema"
            };
            await _movimientoRepository.AddAsync(movimiento);
            
            return Ok(_mapper.Map<PostulacionDto>(postulacion));
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "PostulanteOnly")]
        public async Task<ActionResult> Delete(int id)
        {
            var postulacion = await _postulacionRepository.GetByIdAsync(id);
            if (postulacion == null)
                return NotFound();

            if (postulacion.Estado != EstadoPostulacion.Pendiente)
                return BadRequest("Solo puedes eliminar postulaciones pendientes");

            postulacion.Activo = false;
            postulacion.FechaActualizacion = _auditService.GetCurrentDateTime();
            postulacion.ActualizadoPor = _auditService.GetCurrentUserName();

            await _postulacionRepository.UpdateAsync(postulacion);
            return NoContent();
        }
    }
}
