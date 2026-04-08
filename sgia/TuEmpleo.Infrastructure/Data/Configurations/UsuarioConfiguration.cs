using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuEmpleo.Domain.Entities;

namespace TuEmpleo.Infrastructure.Data.Configurations
{
    public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.ToTable("usuarios");
            
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).HasColumnName("id");
            builder.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(100).IsRequired();
            builder.Property(e => e.Apellido).HasColumnName("apellido").HasMaxLength(100).IsRequired();
            builder.Property(e => e.Email).HasColumnName("email").HasMaxLength(150).IsRequired();
            builder.Property(e => e.Telefono).HasColumnName("telefono").HasMaxLength(20);
            builder.Property(e => e.Ubicacion).HasColumnName("ubicacion").HasMaxLength(100);
            builder.Property(e => e.UrlCurriculo).HasColumnName("url_curriculo");
            builder.Property(e => e.Habilidades).HasColumnName("habilidades");
            builder.Property(e => e.Experiencia).HasColumnName("experiencia");
            builder.Property(e => e.RutaCV).HasColumnName("ruta_cv");
            builder.Property(e => e.KeycloakId).HasColumnName("keycloak_id");
            builder.Property(e => e.Rol).HasColumnName("rol").HasConversion<string>();
            builder.Property(e => e.FechaCreacion).HasColumnName("fecha_creacion");
            builder.Property(e => e.CreadoPor).HasColumnName("creado_por").HasMaxLength(100);
            builder.Property(e => e.FechaActualizacion).HasColumnName("fecha_actualizacion");
            builder.Property(e => e.ActualizadoPor).HasColumnName("actualizado_por").HasMaxLength(100);
            builder.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);

            builder.HasIndex(e => e.Email).IsUnique();
            builder.HasIndex(e => e.KeycloakId).IsUnique();
        }
    }
}
