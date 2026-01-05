using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinancialApi.Data;
using FinancialApi.Models;

namespace FinancialApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SettingsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<AppSettings>> GetSettings()
        {
            var settings = await _context.Settings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new AppSettings { ExchangeRate = 5.0m, LastUpdated = DateTime.Now };
                _context.Settings.Add(settings);
                await _context.SaveChangesAsync();
            }
            return settings;
        }

        [HttpPost]
        public async Task<ActionResult<AppSettings>> UpdateSettings(AppSettings settings)
        {
            var existing = await _context.Settings.FirstOrDefaultAsync();
            if (existing == null)
            {
                _context.Settings.Add(settings);
            }
            else
            {
                existing.ExchangeRate = settings.ExchangeRate;
                existing.LastUpdated = DateTime.Now;
            }
            await _context.SaveChangesAsync();
            return Ok(settings);
        }
    }
}
