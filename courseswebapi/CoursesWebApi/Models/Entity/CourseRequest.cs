using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoursesWebApi.Models.Entity
{
    public class CourseRequest
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public bool Authorized { get; set; } = false;
        [Required]
        public string Email { get; set; }
        public string? PhoneNr { get; set; }
        [Required]
        public string Message { get; set; } = string.Empty;
        public bool Completed { get; set; } = false;
        public int? CourseId { get; set; }
        public int? SectionId { get; set; }
        public virtual Course Course { get; set; }
        public virtual CourseSection Section { get; set; }

    }
}
