using Microsoft.EntityFrameworkCore;
using TuEmpleo.Domain.Entities;
using TuEmpleo.Infrastructure.Data;

namespace TuEmpleo.Infrastructure.Repositories
{
    public interface ICategoriaEmpleoRepository : IGenericRepository<CategoriaEmpleo>
    {
        Task<CategoriaEmpleo?> GetByNombreAsync(string nombre);
    }

    public class CategoriaEmpleoRepository : GenericRepository<CategoriaEmpleo>, ICategoriaEmpleoRepository
    {
        public CategoriaEmpleoRepository(AppDbContext context) : base(context) { }

        public async Task<CategoriaEmpleo?> GetByNombreAsync(string nombre)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.Nombre == nombre);
        }
    }
}
