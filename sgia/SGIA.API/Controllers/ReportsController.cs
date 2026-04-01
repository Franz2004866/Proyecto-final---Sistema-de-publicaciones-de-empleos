using System.Text;
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
    public class ReportsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IMovementRepository _movementRepository;
        private readonly IMapper _mapper;

        public ReportsController(
            IProductRepository productRepository,
            IMovementRepository movementRepository,
            IMapper mapper)
        {
            _productRepository = productRepository;
            _movementRepository = movementRepository;
            _mapper = mapper;
        }

        [HttpGet("stock-value")]
        public async Task<IActionResult> GetStockValueReport()
        {
            var products = await _productRepository.GetAllWithCategoryAsync(false);
            
            var report = products.Select(p => new
            {
                p.Code,
                p.Name,
                p.Category,
                p.CurrentStock,
                p.UnitPrice,
                TotalValue = p.CurrentStock * p.UnitPrice
            }).ToList();

            return Ok(new
            {
                TotalProducts = report.Count,
                TotalValue = report.Sum(r => r.TotalValue),
                ByCategory = report.GroupBy(p => p.Category).Select(g => new
                {
                    Category = g.Key,
                    Count = g.Count(),
                    Value = g.Sum(x => x.TotalValue)
                }).ToList(),
                Data = report
            });
        }

        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStockReport()
        {
            var products = await _productRepository.GetLowStockProductsAsync();
            var report = products.Select(p => new
            {
                p.Code,
                p.Name,
                p.Category,
                p.CurrentStock,
                p.MinimalStock,
                Shortage = p.MinimalStock - p.CurrentStock
            }).ToList();

            return Ok(report);
        }

        [HttpGet("export-csv")]
        public async Task<IActionResult> ExportToCsv()
        {
            var products = await _productRepository.GetAllWithCategoryAsync(false);

            var sb = new StringBuilder();
            sb.AppendLine("Code,Name,Category,CurrentStock,MinimalStock,UnitPrice,TotalValue,IsActive");

            foreach (var p in products)
            {
                sb.AppendLine($"{p.Code},{p.Name},{p.Category},{p.CurrentStock},{p.MinimalStock},{p.UnitPrice},{p.CurrentStock * p.UnitPrice},{p.IsActive}");
            }

            return File(Encoding.UTF8.GetBytes(sb.ToString()), "text/csv", "inventory_export.csv");
        }

        [HttpGet("movement-summary")]
        public async Task<IActionResult> GetMovementSummary([FromQuery] DateTime? dateFrom, [FromQuery] DateTime? dateTo)
        {
            var movements = await _movementRepository.GetMovementsAsync(null, null, dateFrom, dateTo);
            var movementList = movements.ToList();

            var summary = new
            {
                TotalMovements = movementList.Count,
                TotalEntries = movementList.Count(m => m.Type == MovementType.Entry),
                TotalExits = movementList.Count(m => m.Type == MovementType.Exit),
                TotalQuantityIn = movementList.Where(m => m.Type == MovementType.Entry).Sum(m => m.Quantity),
                TotalQuantityOut = movementList.Where(m => m.Type == MovementType.Exit).Sum(m => m.Quantity),
                ByProduct = movementList.GroupBy(m => m.ProductId).Select(g => new
                {
                    ProductName = g.First().Product?.Name ?? "Unknown",
                    Entries = g.Count(m => m.Type == MovementType.Entry),
                    Exits = g.Count(m => m.Type == MovementType.Exit)
                }).ToList()
            };

            return Ok(summary);
        }
    }
}
