using Microsoft.EntityFrameworkCore;
using SGIA.Application.Common.Interfaces;
using SGIA.Domain.Entities;
using SGIA.Infrastructure.Data;

namespace SGIA.Infrastructure.Repositories
{
    public class MovementRepository : GenericRepository<Movement>, IMovementRepository
    {
        public MovementRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Movement>> GetByProductIdAsync(Guid productId)
        {
            return await _context.Movements
                .Include(m => m.Product)
                .Where(m => m.ProductId == productId)
                .OrderByDescending(m => m.MovementDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Movement>> GetMovementsAsync(Guid? productId, MovementType? type, DateTime? dateFrom, DateTime? dateTo)
        {
            var query = _context.Movements.Include(m => m.Product).AsQueryable();

            if (productId.HasValue)
                query = query.Where(m => m.ProductId == productId.Value);

            if (type.HasValue)
                query = query.Where(m => m.Type == type.Value);

            if (dateFrom.HasValue)
                query = query.Where(m => m.MovementDate >= dateFrom.Value);

            if (dateTo.HasValue)
                query = query.Where(m => m.MovementDate <= dateTo.Value);

            return await query.OrderByDescending(m => m.MovementDate).ToListAsync();
        }

        public async Task<IEnumerable<Movement>> GetRecentMovementsAsync(int count = 10)
        {
            return await _context.Movements
                .Include(m => m.Product)
                .OrderByDescending(m => m.CreatedAt)
                .Take(count)
                .ToListAsync();
        }
    }
}
