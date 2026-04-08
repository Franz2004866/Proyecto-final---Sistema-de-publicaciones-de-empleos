using Microsoft.EntityFrameworkCore;
using TuEmpleo.Domain.Entities;
using TuEmpleo.Infrastructure.Data;
using TuEmpleo.Infrastructure.Repositories;

namespace TuEmpleo.Infrastructure.Repositories;

public interface IMovimientoPostulacionRepository : IGenericRepository<MovimientoPostulacion>
{
    Task<IEnumerable<MovimientoPostulacion>> GetByPostulacionIdAsync(int postulacionId);
    Task<IEnumerable<MovimientoPostulacion>> GetByEmpleoIdAsync(int empleoId);
    Task<IEnumerable<MovimientoPostulacion>> GetByEmpresaIdAsync(int empresaId);
}

public class MovimientoPostulacionRepository : GenericRepository<MovimientoPostulacion>, IMovimientoPostulacionRepository
{
    public MovimientoPostulacionRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<MovimientoPostulacion>> GetByPostulacionIdAsync(int postulacionId)
    {
        return await _dbSet
            .Where(m => m.PostulacionId == postulacionId)
            .OrderByDescending(m => m.FechaCreacion)
            .ToListAsync();
    }

    public async Task<IEnumerable<MovimientoPostulacion>> GetByEmpleoIdAsync(int empleoId)
    {
        return await _dbSet
            .Include(m => m.Postulacion)
            .Where(m => m.Postulacion != null && m.Postulacion.EmpleoId == empleoId)
            .OrderByDescending(m => m.FechaCreacion)
            .ToListAsync();
    }

    public async Task<IEnumerable<MovimientoPostulacion>> GetByEmpresaIdAsync(int empresaId)
    {
        return await _dbSet
            .Include(m => m.Postulacion)
            .Where(m => m.Postulacion != null && m.Postulacion.Empleo != null && m.Postulacion.EmpleoId == empresaId)
            .OrderByDescending(m => m.FechaCreacion)
            .ToListAsync();
    }
}
