using Microsoft.EntityFrameworkCore;
using SGIA.Application.Common.Interfaces;
using SGIA.Domain.Entities;
using SGIA.Infrastructure.Data;
using System.Linq.Expressions;

namespace SGIA.Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<T?> GetByIdAsync(Guid id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<T>> GetAllAsync(bool includeInactive = false)
        {
            if (includeInactive || typeof(T) == typeof(BaseEntity) == false)
            {
                return await _dbSet.ToListAsync();
            }

            var parameter = Expression.Parameter(typeof(T), "x");
            var property = Expression.Property(parameter, nameof(BaseEntity.IsActive));
            var constant = Expression.Constant(true);
            var comparison = Expression.Equal(property, constant);
            var lambda = Expression.Lambda<Func<T, bool>>(comparison, parameter);

            return await _dbSet.Where(lambda).ToListAsync();
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public async Task<T?> FindSingleAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.FirstOrDefaultAsync(predicate);
        }

        public async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DisableAsync(T entity)
        {
            if (entity is BaseEntity baseEntity)
            {
                baseEntity.IsActive = false;
                baseEntity.UpdatedAt = DateTime.UtcNow;
            }
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }
    }
}
