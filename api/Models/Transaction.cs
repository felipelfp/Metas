using System;

namespace FinancialApi.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public decimal AmountBRL { get; set; }
        public decimal AmountUSD { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; } = string.Empty;
        public string Bank { get; set; } = string.Empty;
        public string? Description { get; set; } // Optional
        public string? ObjectiveId { get; set; } // Optional, if tied to specific objective
    }
}
