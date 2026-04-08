namespace TuEmpleo.Application.DTOs;

public class MovimientoPostulacionDto
{
    public int Id { get; set; }
    public int PostulacionId { get; set; }
    public string TituloEmpleo { get; set; } = string.Empty;
    public string NombrePostulante { get; set; } = string.Empty;
    public string TipoMovimiento { get; set; } = string.Empty;
    public string EstadoAnterior { get; set; } = string.Empty;
    public string EstadoNuevo { get; set; } = string.Empty;
    public string? Observacion { get; set; }
    public string UsuarioResponsable { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; }
}

public class MovimientoPostulacionCreateDto
{
    public int PostulacionId { get; set; }
    public string TipoMovimiento { get; set; } = string.Empty;
    public string EstadoAnterior { get; set; } = string.Empty;
    public string EstadoNuevo { get; set; } = string.Empty;
    public string? Observacion { get; set; }
}
