using Microsoft.EntityFrameworkCore;
using SGIA.Application.Common.Interfaces;
using SGIA.Domain.Entities;
using SGIA.Infrastructure.Data;
using System.Linq.Expressions;

namespace SGIA.Infrastructure.Repositories
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Product>> GetAllWithCategoryAsync(bool includeInactive = false)
        {
            var query = _context.Products.AsQueryable();
            if (!includeInactive)
                query = query.Where(p => p.IsActive);
            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Product>> SearchProductsAsync(string? search, string? category, bool? lowStock)
        {
            var query = _context.Products.Where(p => p.IsActive).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(p => p.Name.Contains(search) || p.Code.Contains(search));

            if (!string.IsNullOrWhiteSpace(category))
                query = query.Where(p => p.Category == category);

            if (lowStock == true)
                query = query.Where(p => p.CurrentStock <= p.MinimalStock);

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetLowStockProductsAsync()
        {
            return await _context.Products
                .Where(p => p.IsActive && p.CurrentStock <= p.MinimalStock)
                .ToListAsync();
        }

        public async Task<Product?> GetByCodeAsync(string code)
        {
            return await _context.Products.FirstOrDefaultAsync(p => p.Code == code);
        }
    }
}
