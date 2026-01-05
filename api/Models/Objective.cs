namespace FinancialApi.Models
{
    public class Objective
    {
        public string Id { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal TargetBRL { get; set; }
        public decimal TargetUSD { get; set; }
        public decimal AccumulatedBRL { get; set; }
        public bool Completed { get; set; }
        public string Category { get; set; } = string.Empty; // "BR", "USA", "EMERGENCY"
    }
}
