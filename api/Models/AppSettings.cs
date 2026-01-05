using System;

namespace FinancialApi.Models
{
    public class AppSettings
    {
        public int Id { get; set; }
        public decimal ExchangeRate { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
