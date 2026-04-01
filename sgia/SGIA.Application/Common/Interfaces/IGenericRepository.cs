using System.Linq.Expressions;

namespace SGIA.Application.Common.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(Guid id);
        Task<IEnumerable<T>> GetAllAsync(bool includeInactive = false);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task<T?> FindSingleAsync(Expression<Func<T, bool>> predicate);
        Task<T> AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DisableAsync(T entity); // Borrado lógico
        Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
    }
}
