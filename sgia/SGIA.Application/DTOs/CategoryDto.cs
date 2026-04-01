namespace SGIA.Application.DTOs
{
    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Color { get; set; } = "#000000";
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string Color { get; set; } = "#000000";
    }

    public class UpdateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string Color { get; set; } = "#000000";
    }
}
