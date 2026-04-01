namespace SGIA.Application.DTOs
{
    public class DashboardSummaryDto
    {
        public int TotalProducts { get; set; }
        public decimal TotalStockValue { get; set; }
        public int LowStockProducts { get; set; }
        public int TotalCategories { get; set; }
        public List<RecentActivityDto> RecentActivity { get; set; } = new();
        public List<LowStockAlertDto> LowStockAlerts { get; set; } = new();
    }

    public class RecentActivityDto
    {
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }

    public class LowStockAlertDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductCode { get; set; } = string.Empty;
        public int CurrentStock { get; set; }
        public int MinimalStock { get; set; }
    }
}
