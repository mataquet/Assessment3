using Microsoft.EntityFrameworkCore;
using Assessment3.Server.Models;

namespace Assessment3.Server.Data
{
    public class TripDbContext : DbContext
    {
        public TripDbContext(DbContextOptions<TripDbContext> options) : base(options)
        {
        }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
