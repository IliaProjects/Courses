using CoursesWebApi.Models.Entity;

namespace CoursesWebApi.Models.DTO
{
    public class RegistrationRequestDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string? FirstName { get; set; }
        public string PhoneNr { get; set; }
        public RoleEnum RoleEnum { get; set; }
    }
}
