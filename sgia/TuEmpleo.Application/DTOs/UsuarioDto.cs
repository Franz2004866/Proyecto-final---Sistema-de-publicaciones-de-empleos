using TuEmpleo.Domain.Entities;

namespace TuEmpleo.Application.DTOs
{
    public class UsuarioDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string? Ubicacion { get; set; }
        public string? UrlCurriculo { get; set; }
        public string? Habilidades { get; set; }
        public string? Experiencia { get; set; }
        public string NombreRol { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
        public bool Activo { get; set; }
    }

    public class CrearUsuarioDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string? Ubicacion { get; set; }
        public string? Habilidades { get; set; }
        public string? Experiencia { get; set; }
        public TipoRol Rol { get; set; } = TipoRol.Postulante;
    }

    public class ActualizarUsuarioDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string? Ubicacion { get; set; }
        public string? UrlCurriculo { get; set; }
        public string? Habilidades { get; set; }
        public string? Experiencia { get; set; }
    }
}
