using TuEmpleo.Domain.Entities;

namespace TuEmpleo.Application.DTOs
{
    public class EmpleoDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string? Requisitos { get; set; }
        public decimal? SalarioMinimo { get; set; }
        public decimal? SalarioMaximo { get; set; }
        public string? Moneda { get; set; }
        public string Modalidad { get; set; } = string.Empty;
        public string? Ubicacion { get; set; }
        public string TipoContrato { get; set; } = string.Empty;
        public DateTime? FechaLimite { get; set; }
        public bool VacantesDisponibles { get; set; }
        public int NumeroVacantes { get; set; }
        public bool Destacado { get; set; }
        public int EmpresaId { get; set; }
        public string NombreEmpresa { get; set; } = string.Empty;
        public int? CategoriaId { get; set; }
        public string? NombreCategoria { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int TotalPostulaciones { get; set; }
        public bool Activo { get; set; }
    }

    public class CrearEmpleoDto
    {
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string? Requisitos { get; set; }
        public decimal? SalarioMinimo { get; set; }
        public decimal? SalarioMaximo { get; set; }
        public string? Moneda { get; set; } = "USD";
        public ModalidadTrabajo Modalidad { get; set; } = ModalidadTrabajo.Presencial;
        public string? Ubicacion { get; set; }
        public TipoContrato TipoContrato { get; set; } = TipoContrato.TiempoCompleto;
        public DateTime? FechaLimite { get; set; }
        public int NumeroVacantes { get; set; } = 1;
        public bool Destacado { get; set; } = false;
        public int? CategoriaId { get; set; }
    }

    public class ActualizarEmpleoDto
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string? Requisitos { get; set; }
        public decimal? SalarioMinimo { get; set; }
        public decimal? SalarioMaximo { get; set; }
        public string? Moneda { get; set; }
        public ModalidadTrabajo Modalidad { get; set; }
        public string? Ubicacion { get; set; }
        public TipoContrato TipoContrato { get; set; }
        public DateTime? FechaLimite { get; set; }
        public int NumeroVacantes { get; set; }
        public bool VacantesDisponibles { get; set; }
        public bool Destacado { get; set; }
        public int? CategoriaId { get; set; }
    }

    public class EmpleoFiltroDto
    {
        public string? Busqueda { get; set; }
        public ModalidadTrabajo? Modalidad { get; set; }
        public TipoContrato? TipoContrato { get; set; }
        public int? CategoriaId { get; set; }
        public string? Ubicacion { get; set; }
        public decimal? SalarioMinimo { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
