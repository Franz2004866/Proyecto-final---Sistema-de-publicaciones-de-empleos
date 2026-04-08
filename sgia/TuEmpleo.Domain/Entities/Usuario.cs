namespace TuEmpleo.Domain.Entities
{
    public class Usuario : EntidadBase
    {
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string? Ubicacion { get; set; }
        public string? UrlCurriculo { get; set; }
        public string? Habilidades { get; set; }
        public string? Experiencia { get; set; }
        public string? RutaCV { get; set; }
        public Guid KeycloakId { get; set; }
        public TipoRol Rol { get; set; } = TipoRol.Postulante;
        
        public ICollection<Empleo> EmpleosPublicados { get; set; } = new List<Empleo>();
        public ICollection<Postulacion> Postulaciones { get; set; } = new List<Postulacion>();
    }

    public enum TipoRol
    {
        Postulante = 1,
        Empresa = 2,
        Administrador = 3
    }
}
