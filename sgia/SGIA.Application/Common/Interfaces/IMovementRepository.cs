using SGIA.Domain.Entities;

namespace SGIA.Application.Common.Interfaces
{
    public interface IMovementRepository : IGenericRepository<Movement>
    {
        Task<IEnumerable<Movement>> GetByProductIdAsync(Guid productId);
        Task<IEnumerable<Movement>> GetMovementsAsync(Guid? productId, MovementType? type, DateTime? dateFrom, DateTime? dateTo);
        Task<IEnumerable<Movement>> GetRecentMovementsAsync(int count = 10);
    }
}
