using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoursesWebApi.Models.Entity
{
    public class LessonVideo
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Url { get; set; }
        [Required]
        public DateTime Uploaded { get; set; }
        public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();

    }
}
