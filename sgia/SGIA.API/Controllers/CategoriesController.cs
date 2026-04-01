using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SGIA.Application.Common.Interfaces;
using SGIA.Application.DTOs;
using SGIA.Domain.Entities;

namespace SGIA.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IAuditService _auditService;
        private readonly IMapper _mapper;

        public CategoriesController(
            ICategoryRepository categoryRepository,
            IAuditService auditService,
            IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _auditService = auditService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] bool includeInactive = false)
        {
            var categories = await _categoryRepository.GetAllAsync(includeInactive);
            var categoryDtos = _mapper.Map<IEnumerable<CategoryDto>>(categories);
            return Ok(categoryDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
                return NotFound(new { message = "Categoría no encontrada" });

            var categoryDto = _mapper.Map<CategoryDto>(category);
            return Ok(categoryDto);
        }

        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = _mapper.Map<Category>(createDto);
            category.Id = Guid.NewGuid();
            category.CreatedAt = _auditService.GetCurrentDateTime();
            category.CreatedBy = _auditService.GetCurrentUserId();
            category.IsActive = true;

            await _categoryRepository.AddAsync(category);
            var categoryDto = _mapper.Map<CategoryDto>(category);
            return CreatedAtAction(nameof(GetById), new { id = category.Id }, categoryDto);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryDto updateDto)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
                return NotFound(new { message = "Categoría no encontrada" });

            _mapper.Map(updateDto, category);
            category.UpdatedAt = _auditService.GetCurrentDateTime();
            category.UpdatedBy = _auditService.GetCurrentUserId();

            await _categoryRepository.UpdateAsync(category);
            var categoryDto = _mapper.Map<CategoryDto>(category);
            return Ok(categoryDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
                return NotFound(new { message = "Categoría no encontrada" });

            await _categoryRepository.DisableAsync(category);
            return NoContent();
        }
    }
}
