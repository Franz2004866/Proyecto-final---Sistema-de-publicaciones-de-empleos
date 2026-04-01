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
    public class DashboardController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMovementRepository _movementRepository;
        private readonly IMapper _mapper;

        public DashboardController(
            IProductRepository productRepository,
            ICategoryRepository categoryRepository,
            IMovementRepository movementRepository,
            IMapper mapper)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
            _movementRepository = movementRepository;
            _mapper = mapper;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var products = await _productRepository.GetAllWithCategoryAsync(false);
            var categories = await _categoryRepository.GetAllAsync(false);
            var lowStockProducts = await _productRepository.GetLowStockProductsAsync();
            var recentMovements = await _movementRepository.GetRecentMovementsAsync(10);

            var totalProducts = products.Count();
            var totalStockValue = products.Sum(p => p.CurrentStock * p.UnitPrice);
            var lowStockCount = lowStockProducts.Count();
            var totalCategories = categories.Count();

            var recentActivity = recentMovements.Select(m => new RecentActivityDto
            {
                Type = m.Type == MovementType.Entry ? "Entrada" : "Salida",
                Description = $"{m.Type}: {m.Quantity} unidades de {m.Product?.Name}",
                Date = m.CreatedAt
            }).ToList();

            var lowStockAlerts = lowStockProducts.Select(p => new LowStockAlertDto
            {
                ProductId = p.Id,
                ProductName = p.Name,
                ProductCode = p.Code,
                CurrentStock = p.CurrentStock,
                MinimalStock = p.MinimalStock
            }).ToList();

            var summary = new DashboardSummaryDto
            {
                TotalProducts = totalProducts,
                TotalStockValue = totalStockValue,
                LowStockProducts = lowStockCount,
                TotalCategories = totalCategories,
                RecentActivity = recentActivity,
                LowStockAlerts = lowStockAlerts
            };

            return Ok(summary);
        }

        [HttpGet("low-stock-alerts")]
        public async Task<IActionResult> GetLowStockAlerts()
        {
            var lowStockProducts = await _productRepository.GetLowStockProductsAsync();
            var alerts = lowStockProducts.Select(p => new LowStockAlertDto
            {
                ProductId = p.Id,
                ProductName = p.Name,
                ProductCode = p.Code,
                CurrentStock = p.CurrentStock,
                MinimalStock = p.MinimalStock
            }).ToList();

            return Ok(alerts);
        }
    }
}
