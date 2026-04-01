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
    public class MovementsController : ControllerBase
    {
        private readonly IMovementRepository _movementRepository;
        private readonly IProductRepository _productRepository;
        private readonly IAuditService _auditService;
        private readonly IMapper _mapper;

        public MovementsController(
            IMovementRepository movementRepository,
            IProductRepository productRepository,
            IAuditService auditService,
            IMapper mapper)
        {
            _movementRepository = movementRepository;
            _productRepository = productRepository;
            _auditService = auditService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] Guid? productId,
            [FromQuery] MovementType? type,
            [FromQuery] DateTime? dateFrom,
            [FromQuery] DateTime? dateTo)
        {
            var movements = await _movementRepository.GetMovementsAsync(productId, type, dateFrom, dateTo);
            var movementDtos = _mapper.Map<IEnumerable<MovementDto>>(movements);
            return Ok(movementDtos);
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetByProductId(Guid productId)
        {
            var movements = await _movementRepository.GetByProductIdAsync(productId);
            var movementDtos = _mapper.Map<IEnumerable<MovementDto>>(movements);
            return Ok(movementDtos);
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecent([FromQuery] int count = 10)
        {
            var movements = await _movementRepository.GetRecentMovementsAsync(count);
            var movementDtos = _mapper.Map<IEnumerable<MovementDto>>(movements);
            return Ok(movementDtos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMovementDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var product = await _productRepository.GetByIdAsync(createDto.ProductId);
            if (product == null)
                return NotFound(new { message = "Producto no encontrado" });

            if (createDto.Type == MovementType.Exit && product.CurrentStock < createDto.Quantity)
                return BadRequest(new { message = "Stock insuficiente para realizar la salida" });

            var movement = _mapper.Map<Movement>(createDto);
            movement.Id = Guid.NewGuid();
            movement.CreatedAt = _auditService.GetCurrentDateTime();
            movement.CreatedBy = _auditService.GetCurrentUserId();

            if (createDto.Type == MovementType.Entry)
                product.CurrentStock += createDto.Quantity;
            else
                product.CurrentStock -= createDto.Quantity;

            product.UpdatedAt = _auditService.GetCurrentDateTime();
            product.UpdatedBy = _auditService.GetCurrentUserId();

            await _productRepository.UpdateAsync(product);
            await _movementRepository.AddAsync(movement);

            var movementDto = _mapper.Map<MovementDto>(movement);
            return CreatedAtAction(nameof(GetByProductId), new { productId = movement.ProductId }, movementDto);
        }
    }
}
