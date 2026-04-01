namespace SGIA.Application.DTOs
{
    public class ProductDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int CurrentStock { get; set; }
        public int MinimalStock { get; set; }
        public string Category { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateProductDto
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int CurrentStock { get; set; }
        public int MinimalStock { get; set; }
        public string Category { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }

    public class UpdateProductDto
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int CurrentStock { get; set; }
        public int MinimalStock { get; set; }
        public string Category { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }
}
