using Microsoft.AspNetCore.Antiforgery;
using System.ComponentModel.DataAnnotations;

namespace CoursesWebApi.Models.DTO
{
    public class UploadCourseRequestDTO
    {
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        public string Image { get; set; }
    }
}
