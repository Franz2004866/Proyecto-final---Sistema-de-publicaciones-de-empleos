using SGIA.Domain.Entities;

namespace SGIA.Application.DTOs
{
    public class MovementDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductCode { get; set; } = string.Empty;
        public MovementType Type { get; set; }
        public int Quantity { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime MovementDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateMovementDto
    {
        public Guid ProductId { get; set; }
        public MovementType Type { get; set; }
        public int Quantity { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime MovementDate { get; set; } = DateTime.UtcNow;
    }
}
