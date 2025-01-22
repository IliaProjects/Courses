using System.ComponentModel.DataAnnotations;

namespace CoursesWebApi.Models.SearchModels
{
    public class CourseSectionSearchModel
    {
        public string? Name { get; set; }
        public bool bNameContains { get; set; } = false;
        public bool bNameEquals { get; set; } = false;

        public DateTime? CreatedFrom { get; set; }
        public bool bCreatedFrom { get; set; } = false;

        public DateTime? CreatedTo { get; set; }
        public bool bCreatedTo { get; set; } = false;

        public int? CourseId { get; set; }
        public bool bCourseId { get; set; } = false;

        public int? CreatorId { get; set; }
        public bool bCreatorId { get; set; } = false;

        public int? LessonId { get; set; }
        public bool bLessonId { get; set; } = false;

        public int? UserId { get; set; }
        public bool bUserId { get; set; } = false;
        public bool bUserIdUnaccessed { get; set; } = false;
    }
}
