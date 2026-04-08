using Microsoft.EntityFrameworkCore;
using TuEmpleo.Domain.Entities;
using TuEmpleo.Infrastructure.Data;

namespace TuEmpleo.Infrastructure.Repositories
{
    public interface IUsuarioRepository : IGenericRepository<Usuario>
    {
        Task<Usuario?> GetByEmailAsync(string email);
        Task<Usuario?> GetByKeycloakIdAsync(Guid keycloakId);
        Task<IEnumerable<Usuario>> GetByRolAsync(TipoRol rol);
    }

    public class UsuarioRepository : GenericRepository<Usuario>, IUsuarioRepository
    {
        public UsuarioRepository(AppDbContext context) : base(context) { }

        public async Task<Usuario?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<Usuario?> GetByKeycloakIdAsync(Guid keycloakId)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.KeycloakId == keycloakId);
        }

        public async Task<IEnumerable<Usuario>> GetByRolAsync(TipoRol rol)
        {
            return await _dbSet.Where(u => u.Rol == rol && u.Activo).ToListAsync();
        }
    }
}
