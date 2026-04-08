namespace TuEmpleo.Domain.Entities
{
    public class CategoriaEmpleo : EntidadBase
    {
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string Color { get; set; } = "#3B82F6";
        public string Icono { get; set; } = "work";
        
        public ICollection<Empleo> Empleos { get; set; } = new List<Empleo>();
    }
}
