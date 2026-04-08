namespace TuEmpleo.Domain.Entities
{
    public class Postulacion : EntidadBase
    {
        public int EmpleoId { get; set; }
        public Empleo? Empleo { get; set; }
        
        public int PostulanteId { get; set; }
        public Usuario? Postulante { get; set; }
        
        public string? CartaPresentacion { get; set; }
        public string? UrlCurriculo { get; set; }
        public EstadoPostulacion Estado { get; set; } = EstadoPostulacion.Pendiente;
        public DateTime FechaPostulacion { get; set; }
        public DateTime? FechaRevision { get; set; }
        public string? Notas { get; set; }
        
        public ICollection<MovimientoPostulacion> Movimientos { get; set; } = new List<MovimientoPostulacion>();
    }

    public enum EstadoPostulacion
    {
        Pendiente = 1,
        EnRevision = 2,
        Entrevista = 3,
        Aprobado = 4,
        Rechazado = 5
    }
}
