namespace SGIA.Domain.Entities
{
    public class Product: BaseEntity
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
