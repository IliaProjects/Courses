using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoursesWebApi.Models.Entity
{
    public class User
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Email { get; set; }

        public string? Name { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNr { get; set; }
        public byte[]? Photo { get; set; }
        [Required]
        public string Password { get; set; }
        [Required] 
        public int RoleId { get; set; }
        [Required]
        public RoleEnum RoleEnum { get; set; }
        [Required]
        public virtual Role Role { get; set; }
        [Required]
        public virtual ICollection<CourseSection> CourseSections { get; set; } = new List<CourseSection>();
    

        public DateTime lastRequest { get; set; }
        [Required]
        public DateTime RegDate { get; set; } = DateTime.UtcNow;
    }
}
