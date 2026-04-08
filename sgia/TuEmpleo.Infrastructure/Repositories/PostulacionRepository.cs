using Microsoft.EntityFrameworkCore;
using TuEmpleo.Application.DTOs;
using TuEmpleo.Domain.Entities;
using TuEmpleo.Infrastructure.Data;

namespace TuEmpleo.Infrastructure.Repositories
{
    public interface IPostulacionRepository : IGenericRepository<Postulacion>
    {
        Task<IEnumerable<Postulacion>> GetFilteredAsync(PostulacionFiltroDto filtro);
        Task<Postulacion?> GetWithDetailsAsync(int id);
        Task<IEnumerable<Postulacion>> GetByEmpleoAsync(int empleoId);
        Task<IEnumerable<Postulacion>> GetByPostulanteAsync(int postulanteId);
        Task<bool> ExistsPostulacionAsync(int empleoId, int postulanteId);
    }

    public class PostulacionRepository : GenericRepository<Postulacion>, IPostulacionRepository
    {
        public PostulacionRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Postulacion>> GetFilteredAsync(PostulacionFiltroDto filtro)
        {
            var query = _dbSet.Where(p => p.Activo);

            if (filtro.EmpleoId.HasValue)
                query = query.Where(p => p.EmpleoId == filtro.EmpleoId.Value);

            if (filtro.PostulanteId.HasValue)
                query = query.Where(p => p.PostulanteId == filtro.PostulanteId.Value);

            if (filtro.Estado.HasValue)
                query = query.Where(p => p.Estado == filtro.Estado.Value);

            if (filtro.FechaDesde.HasValue)
                query = query.Where(p => p.FechaPostulacion >= filtro.FechaDesde.Value);

            if (filtro.FechaHasta.HasValue)
                query = query.Where(p => p.FechaPostulacion <= filtro.FechaHasta.Value);

            return await query
                .Include(p => p.Empleo)
                .Include(p => p.Postulante)
                .OrderByDescending(p => p.FechaPostulacion)
                .Skip((filtro.Page - 1) * filtro.PageSize)
                .Take(filtro.PageSize)
                .ToListAsync();
        }

        public async Task<Postulacion?> GetWithDetailsAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Empleo)
                    .ThenInclude(e => e!.Empresa)
                .Include(p => p.Postulante)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Postulacion>> GetByEmpleoAsync(int empleoId)
        {
            return await _dbSet
                .Where(p => p.EmpleoId == empleoId && p.Activo)
                .Include(p => p.Postulante)
                .OrderByDescending(p => p.FechaPostulacion)
                .ToListAsync();
        }

        public async Task<IEnumerable<Postulacion>> GetByPostulanteAsync(int postulanteId)
        {
            return await _dbSet
                .Where(p => p.PostulanteId == postulanteId && p.Activo)
                .Include(p => p.Empleo)
                    .ThenInclude(e => e!.Categoria)
                .OrderByDescending(p => p.FechaPostulacion)
                .ToListAsync();
        }

        public async Task<bool> ExistsPostulacionAsync(int empleoId, int postulanteId)
        {
            return await _dbSet.AnyAsync(p => p.EmpleoId == empleoId && p.PostulanteId == postulanteId);
        }
    }
}
