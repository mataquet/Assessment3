﻿namespace Assessment3.Server.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Login { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string HashedPassword { get; set; } = string.Empty;
    }
}
