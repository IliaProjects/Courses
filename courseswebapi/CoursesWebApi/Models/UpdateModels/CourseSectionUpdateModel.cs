using CoursesWebApi.Models.Entity;

namespace CoursesWebApi.Models.UpdateModels
{
    public class CourseSectionUpdateModel
    {
        public int CourseSectionId { get; set; }
        public string? Name { get; set; }
        public bool bName { get; set; } = false;
        
        public string? Description { get; set; }
        public bool bDescription { get; set; } = false;
        
        public string? Image { get; set; }
        public bool bImage { get; set; } = false;
        
        public int? CourseId { get; set; }
        public bool bCourseId { get; set; } = false;

        public User? User { get; set; }
        public bool bOpenAccess { get; set; } = false;
        public bool bCloseAccess { get; set; } = false;

        public int Order { get; set; }
        public bool bOrder { get; set; } 
    }
}
