using EventHub.Domain.Enums;

namespace EventHub.BLL.Models
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public UserRole ApplyAs { get; set; }
        public AccountStatus Status { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Avatar { get; set; }
        public string Username { get; set; } = string.Empty;
    }

    public class UpdateUserRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Avatar { get; set; }
        public string? PhoneNumber { get; set; }
        public string? CompanyName { get; set; }
    }
}
