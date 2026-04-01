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
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IAuditService _auditService;
        private readonly IMapper _mapper;

        public ProductsController(
            IProductRepository productRepository,
            IAuditService auditService,
            IMapper mapper)
        {
            _productRepository = productRepository;
            _auditService = auditService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] bool includeInactive = false,
            [FromQuery] string? search = null,
            [FromQuery] string? category = null,
            [FromQuery] bool? lowStock = null)
        {
            IEnumerable<Product> products;
            
            if (!string.IsNullOrWhiteSpace(search) || !string.IsNullOrWhiteSpace(category) || lowStock.HasValue)
                products = await _productRepository.SearchProductsAsync(search, category, lowStock);
            else
                products = await _productRepository.GetAllWithCategoryAsync(includeInactive);

            var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);
            return Ok(productDtos);
        }

        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStock()
        {
            var products = await _productRepository.GetLowStockProductsAsync();
            var productDtos = _mapper.Map<IEnumerable<ProductDto>>(products);
            return Ok(productDtos);
        }

        [HttpGet("code/{code}")]
        public async Task<IActionResult> GetByCode(string code)
        {
            var product = await _productRepository.GetByCodeAsync(code);
            if (product == null)
                return NotFound(new { message = "Producto no encontrado" });

            var productDto = _mapper.Map<ProductDto>(product);
            return Ok(productDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Producto no encontrado" });

            var productDto = _mapper.Map<ProductDto>(product);
            return Ok(productDto);
        }

        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Create([FromBody] CreateProductDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = _mapper.Map<Product>(createDto);
            product.Id = Guid.NewGuid();
            product.CreatedAt = _auditService.GetCurrentDateTime();
            product.CreatedBy = _auditService.GetCurrentUserId();
            product.IsActive = true;

            await _productRepository.AddAsync(product);
            var productDto = _mapper.Map<ProductDto>(product);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, productDto);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto updateDto)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Producto no encontrado" });

            _mapper.Map(updateDto, product);
            product.UpdatedAt = _auditService.GetCurrentDateTime();
            product.UpdatedBy = _auditService.GetCurrentUserId();

            await _productRepository.UpdateAsync(product);
            var productDto = _mapper.Map<ProductDto>(product);
            return Ok(productDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { message = "Producto no encontrado" });

            await _productRepository.DisableAsync(product);
            return NoContent();
        }
    }
}
