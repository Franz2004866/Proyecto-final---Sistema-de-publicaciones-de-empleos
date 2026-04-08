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
    public class CategoriasController : ControllerBase
    {
        private readonly ICategoriaEmpleoRepository _categoriaRepository;
        private readonly IMapper _mapper;
        private readonly IAuditService _auditService;

        public CategoriasController(
            ICategoriaEmpleoRepository categoriaRepository,
            IMapper mapper,
            IAuditService auditService)
        {
            _categoriaRepository = categoriaRepository;
            _mapper = mapper;
            _auditService = auditService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaEmpleoDto>>> GetAll()
        {
            var categorias = await _categoriaRepository.GetAllAsync();
            return Ok(_mapper.Map<IEnumerable<CategoriaEmpleoDto>>(categorias.Where(c => c.Activo)));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriaEmpleoDto>> GetById(int id)
        {
            var categoria = await _categoriaRepository.GetByIdAsync(id);
            if (categoria == null)
                return NotFound();

            return Ok(_mapper.Map<CategoriaEmpleoDto>(categoria));
        }

        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<CategoriaEmpleoDto>> Create([FromBody] CrearCategoriaEmpleoDto dto)
        {
            var existente = await _categoriaRepository.GetByNombreAsync(dto.Nombre);
            if (existente != null)
                return BadRequest("Ya existe una categoría con este nombre");

            var categoria = _mapper.Map<CategoriaEmpleo>(dto);
            categoria.FechaCreacion = _auditService.GetCurrentDateTime();
            categoria.CreadoPor = _auditService.GetCurrentUserName();
            categoria.Activo = true;

            await _categoriaRepository.AddAsync(categoria);
            return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, _mapper.Map<CategoriaEmpleoDto>(categoria));
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<CategoriaEmpleoDto>> Update(int id, [FromBody] ActualizarCategoriaEmpleoDto dto)
        {
            var categoria = await _categoriaRepository.GetByIdAsync(id);
            if (categoria == null)
                return NotFound();

            _mapper.Map(dto, categoria);
            categoria.FechaActualizacion = _auditService.GetCurrentDateTime();
            categoria.ActualizadoPor = _auditService.GetCurrentUserName();

            await _categoriaRepository.UpdateAsync(categoria);
            return Ok(_mapper.Map<CategoriaEmpleoDto>(categoria));
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> Delete(int id)
        {
            var categoria = await _categoriaRepository.GetByIdAsync(id);
            if (categoria == null)
                return NotFound();

            categoria.Activo = false;
            categoria.FechaActualizacion = _auditService.GetCurrentDateTime();
            categoria.ActualizadoPor = _auditService.GetCurrentUserName();

            await _categoriaRepository.UpdateAsync(categoria);
            return NoContent();
        }
    }
}
