using Microsoft.EntityFrameworkCore;
using Assessment3.Server.Data;
using Assessment3.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Assessment3.Server.Service;

namespace Assessment3.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly TripDbContext _context;
        private JWTService _jwtservice;
        public UserController(TripDbContext context, JWTService jwtservice) 
        {
            this._context = context;
            this._jwtservice = jwtservice;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserPayload userPayload)
        {


            if (await _context.Users.AnyAsync(u => u.Email == userPayload.Email || u.Login == userPayload.Login))
            {
                return BadRequest("User already exists");
            }

            else
            {
                var user = new User
                {
                    Login = userPayload.Login,
                    FirstName = userPayload.FirstName,
                    LastName = userPayload.LastName,
                    HashedPassword = BCrypt.Net.BCrypt.HashPassword(userPayload.Password),
                    Email = userPayload.Email
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return Ok();
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin userLogin)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Login == userLogin.Login);
            if (user == null || !BCrypt.Net.BCrypt.Verify(userLogin.Password, user.HashedPassword))
            {
                return Unauthorized("Invalid credentials");
            }
            var token = _jwtservice.GenerateToken(user);
            return Ok(token);
        }

    }
}

