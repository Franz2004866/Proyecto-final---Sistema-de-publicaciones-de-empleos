namespace TuEmpleo.Application.DTOs
{
    public class DashboardDto
    {
        public int TotalEmpleos { get; set; }
        public int TotalPostulaciones { get; set; }
        public int TotalPostulantes { get; set; }
        public int TotalEmpresas { get; set; }
        public int EmpleosActivos { get; set; }
        public int EmpleosDestacados { get; set; }
        public int PostulacionesPendientes { get; set; }
        public List<EmpleoRecienteDto> EmpleosRecientes { get; set; } = new();
        public List<PostulacionRecienteDto> PostulacionesRecientes { get; set; } = new();
        public List<CategoriaEstadisticaDto> EstadisticasPorCategoria { get; set; } = new();
    }

    public class EmpleoRecienteDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string NombreEmpresa { get; set; } = string.Empty;
        public string Modalidad { get; set; } = string.Empty;
        public DateTime FechaPublicacion { get; set; }
        public int TotalPostulaciones { get; set; }
    }

    public class PostulacionRecienteDto
    {
        public int Id { get; set; }
        public string NombrePostulante { get; set; } = string.Empty;
        public string TituloEmpleo { get; set; } = string.Empty;
        public string Estado { get; set; } = string.Empty;
        public DateTime FechaPostulacion { get; set; }
    }

    public class CategoriaEstadisticaDto
    {
        public int CategoriaId { get; set; }
        public string NombreCategoria { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public int TotalEmpleos { get; set; }
        public int TotalPostulaciones { get; set; }
    }

    public class ReporteDto
    {
        public string Titulo { get; set; } = string.Empty;
        public DateTime FechaGeneracion { get; set; }
        public Dictionary<string, object> Datos { get; set; } = new();
    }
}
