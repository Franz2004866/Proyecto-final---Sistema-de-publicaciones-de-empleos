using SGIA.Domain.Entities;

namespace SGIA.Application.Common.Interfaces
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<IEnumerable<Product>> GetAllWithCategoryAsync(bool includeInactive = false);
        Task<IEnumerable<Product>> SearchProductsAsync(string? search, string? category, bool? lowStock);
        Task<IEnumerable<Product>> GetLowStockProductsAsync();
        Task<Product?> GetByCodeAsync(string code);
    }
}
