using System.ComponentModel.DataAnnotations;

namespace CoursesWebApi.Models.DTO
{
    public class UploadSectionRequestDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public int CourseId { get; set; }
        public byte[]? Image { get; set; }
        public string Description { get; set; } = string.Empty;
        public int Order { get; set; }
    }
}
