using TuEmpleo.Domain.Entities;

namespace TuEmpleo.Application.DTOs
{
    public class PostulacionDto
    {
        public int Id { get; set; }
        public int EmpleoId { get; set; }
        public string TituloEmpleo { get; set; } = string.Empty;
        public int PostulanteId { get; set; }
        public string NombrePostulante { get; set; } = string.Empty;
        public string EmailPostulante { get; set; } = string.Empty;
        public string? CartaPresentacion { get; set; }
        public string? UrlCurriculo { get; set; }
        public string Estado { get; set; } = string.Empty;
        public DateTime FechaPostulacion { get; set; }
        public DateTime? FechaRevision { get; set; }
        public string? Notas { get; set; }
        public bool Activo { get; set; }
    }

    public class CrearPostulacionDto
    {
        public int EmpleoId { get; set; }
        public string? CartaPresentacion { get; set; }
        public string? UrlCurriculo { get; set; }
    }

    public class ActualizarPostulacionDto
    {
        public int Id { get; set; }
        public EstadoPostulacion Estado { get; set; }
        public string? Notas { get; set; }
    }

    public class PostulacionFiltroDto
    {
        public int? EmpleoId { get; set; }
        public int? PostulanteId { get; set; }
        public EstadoPostulacion? Estado { get; set; }
        public DateTime? FechaDesde { get; set; }
        public DateTime? FechaHasta { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
