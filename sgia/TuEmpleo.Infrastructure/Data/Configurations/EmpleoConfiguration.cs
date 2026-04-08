using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuEmpleo.Domain.Entities;

namespace TuEmpleo.Infrastructure.Data.Configurations
{
    public class EmpleoConfiguration : IEntityTypeConfiguration<Empleo>
    {
        public void Configure(EntityTypeBuilder<Empleo> builder)
        {
            builder.ToTable("empleos");
            
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).HasColumnName("id");
            builder.Property(e => e.Titulo).HasColumnName("titulo").HasMaxLength(150).IsRequired();
            builder.Property(e => e.Descripcion).HasColumnName("descripcion").IsRequired();
            builder.Property(e => e.Requisitos).HasColumnName("requisitos");
            builder.Property(e => e.SalarioMinimo).HasColumnName("salario_minimo").HasPrecision(12, 2);
            builder.Property(e => e.SalarioMaximo).HasColumnName("salario_maximo").HasPrecision(12, 2);
            builder.Property(e => e.Moneda).HasColumnName("moneda").HasMaxLength(10).HasDefaultValue("USD");
            builder.Property(e => e.Modalidad).HasColumnName("modalidad").HasConversion<string>();
            builder.Property(e => e.Ubicacion).HasColumnName("ubicacion").HasMaxLength(100);
            builder.Property(e => e.TipoContrato).HasColumnName("tipo_contrato").HasConversion<string>();
            builder.Property(e => e.FechaLimite).HasColumnName("fecha_limite");
            builder.Property(e => e.VacantesDisponibles).HasColumnName("vacantes_disponibles").HasDefaultValue(true);
            builder.Property(e => e.NumeroVacantes).HasColumnName("numero_vacantes").HasDefaultValue(1);
            builder.Property(e => e.Destacado).HasColumnName("destacado").HasDefaultValue(false);
            builder.Property(e => e.EmpresaId).HasColumnName("empresa_id");
            builder.Property(e => e.CategoriaId).HasColumnName("categoria_id");
            builder.Property(e => e.FechaCreacion).HasColumnName("fecha_creacion");
            builder.Property(e => e.CreadoPor).HasColumnName("creado_por").HasMaxLength(100);
            builder.Property(e => e.FechaActualizacion).HasColumnName("fecha_actualizacion");
            builder.Property(e => e.ActualizadoPor).HasColumnName("actualizado_por").HasMaxLength(100);
            builder.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);

            builder.HasOne(e => e.Empresa)
                .WithMany(u => u.EmpleosPublicados)
                .HasForeignKey(e => e.EmpresaId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(e => e.Categoria)
                .WithMany(c => c.Empleos)
                .HasForeignKey(e => e.CategoriaId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasIndex(e => e.Titulo);
            builder.HasIndex(e => e.FechaCreacion);
        }
    }
}
