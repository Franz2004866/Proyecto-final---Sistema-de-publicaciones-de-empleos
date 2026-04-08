namespace TuEmpleo.Domain.Entities
{
    public class Empleo : EntidadBase
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
        public bool VacantesDisponibles { get; set; } = true;
        public int NumeroVacantes { get; set; } = 1;
        public bool Destacado { get; set; } = false;
        
        public int EmpresaId { get; set; }
        public Usuario? Empresa { get; set; }
        
        public int? CategoriaId { get; set; }
        public CategoriaEmpleo? Categoria { get; set; }
        
        public ICollection<Postulacion> Postulaciones { get; set; } = new List<Postulacion>();
    }

    public enum ModalidadTrabajo
    {
        Presencial = 1,
        Remoto = 2,
        Hibrido = 3
    }

    public enum TipoContrato
    {
        TiempoCompleto = 1,
        MedioTiempo = 2,
        ContratoTemporal = 3,
        Practicas = 4,
        PorProyecto = 5
    }
}
