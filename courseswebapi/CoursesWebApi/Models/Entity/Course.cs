using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoursesWebApi.Models.Entity
{
    public class Course
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        public byte[]? Image { get; set; }

        public bool PublishOnMain { get; set; } = false;

        [Required]
        public DateTime Created { get; set; } = DateTime.UtcNow;
        [Required]
        public int UploaderId {  get; set; }
        [Required]
        public virtual User Uploader { get; set; }
        public virtual ICollection<CourseSection> CourseSections { get; set; } = new List<CourseSection>();

    }
}
