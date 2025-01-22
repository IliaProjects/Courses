using CoursesWebApi.Models.Entity;
using System.ComponentModel.DataAnnotations;

namespace CoursesWebApi.Models.DTO
{
    public class ProfileResponseDTO
    {
        [Required]
        public string Email { get; set; }
        public string? Name { get; set; }
        public string? LastName { get; set; }
        public string? Photo { get; set; }
        public string? PhoneNr { get; set; }
        public DateTime RegDate { get; set; }
        public RoleEnum RoleEnum { get; set; }

        public IQueryable<Course> Courses { get; set; } = new List<Course>().AsQueryable();
    }
}
