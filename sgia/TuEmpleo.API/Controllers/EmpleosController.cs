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
    public class EmpleosController : ControllerBase
    {
        private readonly IEmpleoRepository _empleoRepository;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IPostulacionRepository _postulacionRepository;
        private readonly IMapper _mapper;
        private readonly IAuditService _auditService;
        private readonly ICurrentUserService _currentUserService;

        public EmpleosController(
            IEmpleoRepository empleoRepository,
            IUsuarioRepository usuarioRepository,
            IPostulacionRepository postulacionRepository,
            IMapper mapper,
            IAuditService auditService,
            ICurrentUserService currentUserService)
        {
            _empleoRepository = empleoRepository;
            _usuarioRepository = usuarioRepository;
            _postulacionRepository = postulacionRepository;
            _mapper = mapper;
            _auditService = auditService;
            _currentUserService = currentUserService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmpleoDto>>> GetAll([FromQuery] EmpleoFiltroDto filtro)
        {
            var empleos = await _empleoRepository.GetFilteredAsync(filtro);
            return Ok(_mapper.Map<IEnumerable<EmpleoDto>>(empleos));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmpleoDto>> GetById(int id)
        {
            var empleo = await _empleoRepository.GetWithPostulacionesAsync(id);
            if (empleo == null)
                return NotFound();

            return Ok(_mapper.Map<EmpleoDto>(empleo));
        }

        [HttpGet("destacados")]
        public async Task<ActionResult<IEnumerable<EmpleoDto>>> GetDestacados([FromQuery] int count = 5)
        {
            var empleos = await _empleoRepository.GetDestacadosAsync(count);
            return Ok(_mapper.Map<IEnumerable<EmpleoDto>>(empleos));
        }

        [HttpGet("empresa/{empresaId}")]
        [Authorize(Policy = "EmpresaOrAdmin")]
        public async Task<ActionResult<IEnumerable<EmpleoDto>>> GetByEmpresa(int empresaId)
        {
            var empleos = await _empleoRepository.GetByEmpresaAsync(empresaId);
            return Ok(_mapper.Map<IEnumerable<EmpleoDto>>(empleos));
        }

        [HttpPost]
        [Authorize(Policy = "EmpresaOrAdmin")]
        public async Task<ActionResult<EmpleoDto>> Create([FromBody] CrearEmpleoDto dto)
        {
            var email = _currentUserService.GetEmail();
            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var empresa = await _usuarioRepository.GetByEmailAsync(email);
            if (empresa == null)
                return BadRequest("No se encontró la empresa asociada");

            var empleo = _mapper.Map<Empleo>(dto);
            empleo.EmpresaId = empresa.Id;
            empleo.FechaCreacion = _auditService.GetCurrentDateTime();
            empleo.CreadoPor = _auditService.GetCurrentUserName();
            empleo.Activo = true;
            empleo.VacantesDisponibles = true;

            await _empleoRepository.AddAsync(empleo);
            return CreatedAtAction(nameof(GetById), new { id = empleo.Id }, _mapper.Map<EmpleoDto>(empleo));
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "EmpresaOrAdmin")]
        public async Task<ActionResult<EmpleoDto>> Update(int id, [FromBody] ActualizarEmpleoDto dto)
        {
            var email = _currentUserService.GetEmail();
            var empresa = await _usuarioRepository.GetByEmailAsync(email!);
            
            var empleo = await _empleoRepository.GetByIdAsync(id);
            if (empleo == null)
                return NotFound();

            if (empresa != null && empleo.EmpresaId != empresa.Id && !_currentUserService.IsAdmin())
                return Forbid();

            _mapper.Map(dto, empleo);
            empleo.FechaActualizacion = _auditService.GetCurrentDateTime();
            empleo.ActualizadoPor = _auditService.GetCurrentUserName();

            await _empleoRepository.UpdateAsync(empleo);
            return Ok(_mapper.Map<EmpleoDto>(empleo));
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> Delete(int id)
        {
            var empleo = await _empleoRepository.GetByIdAsync(id);
            if (empleo == null)
                return NotFound();

            empleo.Activo = false;
            empleo.FechaActualizacion = _auditService.GetCurrentDateTime();
            empleo.ActualizadoPor = _auditService.GetCurrentUserName();

            await _empleoRepository.UpdateAsync(empleo);
            return NoContent();
        }
    }
}
