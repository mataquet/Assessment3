﻿using Microsoft.EntityFrameworkCore;
using Assessment3.Server.Data;
using Assessment3.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Assessment3.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripController : ControllerBase
    {
        private readonly TripDbContext _context;
        public TripController(TripDbContext context)
        {
            this._context = context;
        }

        [Authorize]
        [HttpPost("create")]

        public async Task<IActionResult> CreateTrip([FromBody] TripPayload tripPayload)
        {
            var usernameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            if (usernameClaim == null)
            {
                return Unauthorized();
            }
            var username = usernameClaim.Value;

            var trip = new Trip
            {
                Name = tripPayload.Name,
                Description = tripPayload.Description,
                DepartureDate = tripPayload.DepartureDate,
                ArrivalDate = tripPayload.ArrivalDate,
                Capacity = tripPayload.Capacity,
                Departure = tripPayload.Departure,
                Arrival = tripPayload.Arrival,
                Price = tripPayload.Price,
                Image = tripPayload.Image,
                owners = new List<string> { username }
            };
            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost("{id}")]
        public async Task<IActionResult> ModifyTrip([FromBody] TripPayload tripChange, int id)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);

            try
            {
                var usernameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
                if (usernameClaim == null)
                {
                    return Unauthorized();
                }
                var username = usernameClaim.Value;

                var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == id);
                if (trip == null)
                {
                    await transaction.RollbackAsync();
                    return NotFound("Trip not found");
                }

                if (!trip.owners.Contains(username))
                {
                    await transaction.RollbackAsync();
                    return Forbid("You are not the owner of this trip");
                }


                if ((tripChange.Capacity < trip.Capacity) && (tripChange.Capacity < trip.participants.Count))
                {
                    await transaction.RollbackAsync();
                    return BadRequest("Capacity cannot be less than the number of participants");
                }


                trip.Name = tripChange.Name;
                trip.Description = tripChange.Description;
                trip.DepartureDate = tripChange.DepartureDate;
                trip.ArrivalDate = tripChange.ArrivalDate;
                trip.Capacity = tripChange.Capacity;
                trip.Departure = tripChange.Departure;
                trip.Arrival = tripChange.Arrival;
                trip.Price = tripChange.Price;
                trip.Image = tripChange.Image;

                var result = await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                await transaction.RollbackAsync();
                return BadRequest("The trip has been modified by another user. Please refresh and try again.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok();

        }

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteTrip(int id)
        {
            var usernameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            if (usernameClaim == null)
            {
                return Unauthorized();
            }
            var username = usernameClaim.Value;
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == id);
            if (trip == null)
            {
                return NotFound("Trip not found");
            }
            if (!trip.owners.Contains(username))
            {
                return Forbid("You are not the owner of this trip");
            }
            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetTrips()
        {
            var usernameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            if (usernameClaim == null)
            {
                return Unauthorized();
            }
            var username = usernameClaim.Value;
            var trips = await _context.Trips.ToListAsync();
            return Ok(trips);
        }

        [Authorize]
        [HttpPut("{id}/join")]
        public async Task<IActionResult> Join(int id)
        {
            var usernameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            Console.WriteLine("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            if (usernameClaim == null)
            {
                return Unauthorized();
            }
            var username = usernameClaim.Value;

            Console.WriteLine("TEstteststeedst"+username);
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == id);
            if (trip == null)
            {
                return NotFound("Trip not found");
            }
            if (trip.participants.Contains(username))
            {
                return BadRequest("You are already a participant in this trip");
            }

            trip.participants.Add(username);
            await _context.SaveChangesAsync();
            return Ok("You are now registered in the trip !");
        }

        [Authorize]
        [HttpPut("{id}/leave")]
        public async Task<IActionResult> Leave(int id)
        {
            var usernameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            if (usernameClaim == null)
            {
                return Unauthorized();
            }
            var username = usernameClaim.Value;
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == id);
            if (trip == null)
            {
                return NotFound("Trip not found");
            }
            if (!trip.participants.Contains(username))
            {
                return BadRequest("You are not a participant in this trip");
            }
            trip.participants.Remove(username);
            await _context.SaveChangesAsync();
            return Ok("You left the trip.");
        }

        [Authorize]
        [HttpPost("addOwner/{tripId}")]
        public async Task<IActionResult> AddOwner(int tripId, string ownerId)
        {
            var usernameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            if (usernameClaim == null)
            {
                return Unauthorized();
            }
            var username = usernameClaim.Value;
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == tripId);
            if (trip == null)
            {
                return NotFound("Trip not found");
            }
            if (!trip.owners.Contains(username))
            {
                return Forbid("You are not the owner of this trip");
            }
            if (trip.owners.Contains(ownerId))
            {
                return BadRequest("User is already an owner of this trip");
            }
            trip.owners.Add(ownerId);
            await _context.SaveChangesAsync();
            return Ok("User is now an owner of this trip");
        }

        [Authorize]
        [HttpGet("details/{id}")]
        public async Task<IActionResult> TripDetails (int id)
        {
            var usernameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            if (usernameClaim == null)
            {
                return Unauthorized();
            }
            var username = usernameClaim.Value;
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.Id == id);
            if (trip == null)
            {
                return NotFound("Trip not found");
            }
            return Ok(trip);
        }
    }
}
