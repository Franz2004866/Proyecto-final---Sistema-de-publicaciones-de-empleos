using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuEmpleo.Domain.Entities;

namespace TuEmpleo.Infrastructure.Data.Configurations
{
    public class PostulacionConfiguration : IEntityTypeConfiguration<Postulacion>
    {
        public void Configure(EntityTypeBuilder<Postulacion> builder)
        {
            builder.ToTable("postulaciones");
            
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).HasColumnName("id");
            builder.Property(e => e.EmpleoId).HasColumnName("empleo_id");
            builder.Property(e => e.PostulanteId).HasColumnName("postulante_id");
            builder.Property(e => e.CartaPresentacion).HasColumnName("carta_presentacion");
            builder.Property(e => e.UrlCurriculo).HasColumnName("url_curriculo");
            builder.Property(e => e.Estado).HasColumnName("estado").HasConversion<string>();
            builder.Property(e => e.FechaPostulacion).HasColumnName("fecha_postulacion");
            builder.Property(e => e.FechaRevision).HasColumnName("fecha_revision");
            builder.Property(e => e.Notas).HasColumnName("notas");
            builder.Property(e => e.FechaCreacion).HasColumnName("fecha_creacion");
            builder.Property(e => e.CreadoPor).HasColumnName("creado_por").HasMaxLength(100);
            builder.Property(e => e.FechaActualizacion).HasColumnName("fecha_actualizacion");
            builder.Property(e => e.ActualizadoPor).HasColumnName("actualizado_por").HasMaxLength(100);
            builder.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);

            builder.HasOne(e => e.Empleo)
                .WithMany(emp => emp.Postulaciones)
                .HasForeignKey(e => e.EmpleoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.Postulante)
                .WithMany(u => u.Postulaciones)
                .HasForeignKey(e => e.PostulanteId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(e => new { e.EmpleoId, e.PostulanteId }).IsUnique();
            builder.HasIndex(e => e.FechaPostulacion);
        }
    }
}
