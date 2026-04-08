namespace TuEmpleo.Domain.Entities;

public class MovimientoPostulacion : EntidadBase
{
    public int PostulacionId { get; set; }
    public Postulacion? Postulacion { get; set; }
    
    public string TipoMovimiento { get; set; } = string.Empty;
    public string EstadoAnterior { get; set; } = string.Empty;
    public string EstadoNuevo { get; set; } = string.Empty;
    public string? Observacion { get; set; }
    public string UsuarioResponsable { get; set; } = string.Empty;
}
