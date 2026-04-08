namespace TuEmpleo.Application.DTOs
{
    public class CategoriaEmpleoDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string Color { get; set; } = string.Empty;
        public string Icono { get; set; } = string.Empty;
        public int TotalEmpleos { get; set; }
        public bool Activo { get; set; }
    }

    public class CrearCategoriaEmpleoDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string Color { get; set; } = "#3B82F6";
        public string Icono { get; set; } = "work";
    }

    public class ActualizarCategoriaEmpleoDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string Color { get; set; } = string.Empty;
        public string Icono { get; set; } = string.Empty;
    }
}
