using Microsoft.EntityFrameworkCore;
using TuEmpleo.Application.DTOs;
using TuEmpleo.Domain.Entities;
using TuEmpleo.Infrastructure.Data;

namespace TuEmpleo.Infrastructure.Repositories
{
    public interface IEmpleoRepository : IGenericRepository<Empleo>
    {
        Task<IEnumerable<Empleo>> GetFilteredAsync(EmpleoFiltroDto filtro);
        Task<Empleo?> GetWithPostulacionesAsync(int id);
        Task<IEnumerable<Empleo>> GetByEmpresaAsync(int empresaId);
        Task<IEnumerable<Empleo>> GetDestacadosAsync(int count = 5);
        Task<int> GetTotalActivosAsync();
    }

    public class EmpleoRepository : GenericRepository<Empleo>, IEmpleoRepository
    {
        public EmpleoRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Empleo>> GetFilteredAsync(EmpleoFiltroDto filtro)
        {
            var query = _dbSet.Where(e => e.Activo && e.VacantesDisponibles);

            if (!string.IsNullOrWhiteSpace(filtro.Busqueda))
            {
                var search = filtro.Busqueda.ToLower();
                query = query.Where(e => e.Titulo.ToLower().Contains(search) || 
                                         e.Descripcion.ToLower().Contains(search) ||
                                         (e.Ubicacion != null && e.Ubicacion.ToLower().Contains(search)));
            }

            if (filtro.Modalidad.HasValue)
                query = query.Where(e => e.Modalidad == filtro.Modalidad.Value);

            if (filtro.TipoContrato.HasValue)
                query = query.Where(e => e.TipoContrato == filtro.TipoContrato.Value);

            if (filtro.CategoriaId.HasValue)
                query = query.Where(e => e.CategoriaId == filtro.CategoriaId.Value);

            if (!string.IsNullOrWhiteSpace(filtro.Ubicacion))
                query = query.Where(e => e.Ubicacion != null && e.Ubicacion.Contains(filtro.Ubicacion));

            if (filtro.SalarioMinimo.HasValue)
                query = query.Where(e => e.SalarioMaximo >= filtro.SalarioMinimo.Value);

            return await query
                .Include(e => e.Empresa)
                .Include(e => e.Categoria)
                .Include(e => e.Postulaciones)
                .OrderByDescending(e => e.FechaCreacion)
                .Skip((filtro.Page - 1) * filtro.PageSize)
                .Take(filtro.PageSize)
                .ToListAsync();
        }

        public async Task<Empleo?> GetWithPostulacionesAsync(int id)
        {
            return await _dbSet
                .Include(e => e.Empresa)
                .Include(e => e.Categoria)
                .Include(e => e.Postulaciones)
                    .ThenInclude(p => p.Postulante)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<Empleo>> GetByEmpresaAsync(int empresaId)
        {
            return await _dbSet
                .Where(e => e.EmpresaId == empresaId && e.Activo)
                .Include(e => e.Categoria)
                .Include(e => e.Postulaciones)
                .OrderByDescending(e => e.FechaCreacion)
                .ToListAsync();
        }

        public async Task<IEnumerable<Empleo>> GetDestacadosAsync(int count = 5)
        {
            return await _dbSet
                .Where(e => e.Activo && e.Destacado && e.VacantesDisponibles)
                .Include(e => e.Empresa)
                .Include(e => e.Categoria)
                .OrderByDescending(e => e.FechaCreacion)
                .Take(count)
                .ToListAsync();
        }

        public async Task<int> GetTotalActivosAsync()
        {
            return await _dbSet.CountAsync(e => e.Activo);
        }
    }
}
