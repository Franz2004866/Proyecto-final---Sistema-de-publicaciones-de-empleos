using Microsoft.EntityFrameworkCore;
using TuEmpleo.Domain.Entities;
using TuEmpleo.Infrastructure.Data.Configurations;

namespace TuEmpleo.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Empleo> Empleos { get; set; }
        public DbSet<Postulacion> Postulaciones { get; set; }
        public DbSet<CategoriaEmpleo> CategoriasEmpleo { get; set; }
        public DbSet<MovimientoPostulacion> MovimientosPostulacion { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new UsuarioConfiguration());
            modelBuilder.ApplyConfiguration(new EmpleoConfiguration());
            modelBuilder.ApplyConfiguration(new PostulacionConfiguration());
            modelBuilder.ApplyConfiguration(new CategoriaEmpleoConfiguration());
            modelBuilder.ApplyConfiguration(new MovimientoPostulacionConfiguration());
        }
    }
}
