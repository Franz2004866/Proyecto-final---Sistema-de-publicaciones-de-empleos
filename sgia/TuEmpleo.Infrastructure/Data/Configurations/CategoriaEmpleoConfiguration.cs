using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuEmpleo.Domain.Entities;

namespace TuEmpleo.Infrastructure.Data.Configurations
{
    public class CategoriaEmpleoConfiguration : IEntityTypeConfiguration<CategoriaEmpleo>
    {
        public void Configure(EntityTypeBuilder<CategoriaEmpleo> builder)
        {
            builder.ToTable("categorias_empleo");
            
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).HasColumnName("id");
            builder.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
            builder.Property(e => e.Descripcion).HasColumnName("descripcion");
            builder.Property(e => e.Color).HasColumnName("color").HasMaxLength(20).HasDefaultValue("#3B82F6");
            builder.Property(e => e.Icono).HasColumnName("icono").HasMaxLength(50).HasDefaultValue("work");
            builder.Property(e => e.FechaCreacion).HasColumnName("fecha_creacion");
            builder.Property(e => e.CreadoPor).HasColumnName("creado_por").HasMaxLength(100);
            builder.Property(e => e.FechaActualizacion).HasColumnName("fecha_actualizacion");
            builder.Property(e => e.ActualizadoPor).HasColumnName("actualizado_por").HasMaxLength(100);
            builder.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);

            builder.HasIndex(e => e.Nombre).IsUnique();
        }
    }
}
