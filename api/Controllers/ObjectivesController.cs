using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinancialApi.Data;
using FinancialApi.Models;

namespace FinancialApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ObjectivesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ObjectivesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Objective>>> GetObjectives()
        {
            return await _context.Objectives.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Objective>> PostObjective(Objective objective)
        {
            var existing = await _context.Objectives.FindAsync(objective.Id);
            if (existing != null)
            {
                // Update existing
                existing.AccumulatedBRL = objective.AccumulatedBRL;
                existing.Completed = objective.Completed;
                // Update other fields if necessary
                await _context.SaveChangesAsync();
                return Ok(existing);
            }
            else
            {
                // Create new
                _context.Objectives.Add(objective);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetObjectives), new { id = objective.Id }, objective);
            }
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutObjective(string id, Objective objective)
        {
            if (id != objective.Id) return BadRequest();

            var existing = await _context.Objectives.FindAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            // Explicitly update fields
            existing.Completed = objective.Completed;
            existing.AccumulatedBRL = objective.AccumulatedBRL;
            existing.TargetBRL = objective.TargetBRL;
            existing.TargetUSD = objective.TargetUSD;
            existing.Name = objective.Name;
            existing.Icon = objective.Icon;
            existing.Category = objective.Category;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ObjectiveExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool ObjectiveExists(string id)
        {
            return _context.Objectives.Any(e => e.Id == id);
        }
    }
}
