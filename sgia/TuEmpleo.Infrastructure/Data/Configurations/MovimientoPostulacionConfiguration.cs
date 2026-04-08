using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuEmpleo.Domain.Entities;

namespace TuEmpleo.Infrastructure.Data.Configurations;

public class MovimientoPostulacionConfiguration : IEntityTypeConfiguration<MovimientoPostulacion>
{
    public void Configure(EntityTypeBuilder<MovimientoPostulacion> builder)
    {
        builder.ToTable("MovimientosPostulacion");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.TipoMovimiento)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(m => m.EstadoAnterior)
            .HasMaxLength(50);

        builder.Property(m => m.EstadoNuevo)
            .HasMaxLength(50);

        builder.Property(m => m.Observacion)
            .HasMaxLength(500);

        builder.Property(m => m.UsuarioResponsable)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasOne(m => m.Postulacion)
            .WithMany(p => p.Movimientos)
            .HasForeignKey(m => m.PostulacionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
