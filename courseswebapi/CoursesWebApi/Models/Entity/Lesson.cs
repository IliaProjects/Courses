using Microsoft.AspNetCore.Http.HttpResults;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoursesWebApi.Models.Entity
{
    public class Lesson
    {

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        public byte[]? Image { get; set; }
        public string? Description { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;
        [Required]
        public DateTime Created { get; set; } = DateTime.UtcNow;
        [Required]
        public DateTime LastEdited { get; set; } = DateTime.UtcNow;
        [Required]
        public int SectionId { get; set; }
        [Required]
        public int CreatorId { get; set; }
        [Required]
        public int LastEditorId { get; set; }
        [Required]
        public virtual CourseSection Section { get; set; }
        [Required]
        public virtual User Creator { get; set; }
        [Required]
        public virtual User LastEditor { get; set; }
        public virtual ICollection<LessonVideo> LessonVideos { get; set; }
    }
}
