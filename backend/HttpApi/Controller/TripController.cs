using Service;
using Microsoft.AspNetCore.Mvc;
using Repository.Models;

namespace HttpApi.Controller;

[ApiController]
[Route("api/[controller]")]
public class TripsController : ControllerBase
{
    private readonly ITripService _service;

    public TripsController(ITripService service)
    {
        _service = service;
    }

    // GET: api/trips
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Trip>>> GetAllTrips()
    {
        return Ok(await _service.GetAllTrips());
    }
    
    // GET: api/trips/public
    [HttpGet("public")]
    public async Task<ActionResult<IEnumerable<Trip>>> GetPublicTrips()
    {
        return Ok(await _service.GetPublicTrips());
    }

    // GET: api/trips/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Trip>> GetTripById(int id)
    {
        var trip = await _service.GetTripById(id);
        if (trip == null)
        {
            return NotFound("Trip not found");
        }
        return Ok(trip);
    }
    
    [HttpGet("bycode/{code}")]
    public async Task<ActionResult<Trip>> GetTripByCode(string code)
    {
        var trip = await _service.GetTripByCode(code);
        if (trip == null)
        {
            return NotFound("Trip not found");
        }
        return Ok(trip);
    }

    // POST: api/trips
    [HttpPost]
    public async Task<ActionResult<Trip>> CreateTrip([FromBody] Trip trip)
    {
        try
        {
            var createdTrip = await _service.CreateTrip(trip);
            return CreatedAtAction(nameof(GetTripById), new { id = createdTrip.ID }, createdTrip);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal Server Error: {ex.Message}");
        }
    }

    // PUT: api/trips/{id}
    [HttpPut("{id}")]
    public async Task<ActionResult<Trip>> UpdateTrip(int id, [FromBody] Trip trip)
    {
        if (id != trip.ID)
        {
            return BadRequest("ID mismatch");
        }

        var updatedTrip = await _service.UpdateTrip(trip);
        if (updatedTrip == null)
        {
            return NotFound("Trip not found");
        }
        return Ok(updatedTrip);
    }

    // DELETE: api/trips/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTrip(int id)
    {
        var isDeleted = await _service.DeleteTrip(id);
        if (!isDeleted)
        {
            return StatusCode(500, "Error deleting the trip");
        }
        return Ok("Trip deleted successfully");
    }
}