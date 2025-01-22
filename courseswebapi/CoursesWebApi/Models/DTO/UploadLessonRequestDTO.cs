 using CoursesWebApi.Models.Entity;
using System.ComponentModel.DataAnnotations;

namespace CoursesWebApi.Models.DTO
{
    public class UploadLessonRequestDTO
    {
        [Required]
        public string Name { get; set; }
        public byte[]? Image { get; set; }
        public string? Description { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        public int SectionId { get; set; }
        public int[] lessonVideosIds { get; set; } = new int[0];
    }
}
