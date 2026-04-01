namespace SGIA.Domain.Entities
{
    public class Movement : BaseEntity
    {
        public Guid ProductId { get; set; }
        public Product? Product { get; set; }
        public MovementType Type { get; set; }
        public int Quantity { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime MovementDate { get; set; }
    }

    public enum MovementType
    {
        Entry = 1,
        Exit = 2
    }
}
