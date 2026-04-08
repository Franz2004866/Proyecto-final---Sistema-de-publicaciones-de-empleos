namespace TuEmpleo.Domain.Entities
{
    public abstract class EntidadBase
    {
        public int Id { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string CreadoPor { get; set; } = string.Empty;
        public DateTime? FechaActualizacion { get; set; }
        public string? ActualizadoPor { get; set; }
        public bool Activo { get; set; } = true;
    }
}
