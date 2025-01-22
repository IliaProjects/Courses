using CoursesWebApi.Models.Entity;

namespace CoursesWebApi.Models.SearchModels
{
    public class CourseSearchModel
    {
        public string? Name { get; set; }
        public bool bNameEquals { get; set; } = false;
        public bool bNameContains { get; set; } = false;
        public DateTime? CreatedFrom { get; set; }
        public bool bCreatedFrom { get; set; } = false;
        public DateTime? CreatedTo { get; set; }
        public bool bCreatedTo { get; set; } = false;
        public int UploaderId { get; set; }
        public bool bUploaderId { get; set; } = false;
        public int CourseSectionId { get; set; }
        public bool bCourseSectionId { get; set; } = false;
        public int LessonId { get; set; }
        public bool bLessonId { get; set; } = false;
        public int UserId { get; set; }
        public bool bUserId { get; set; } = false;
        public bool bUserIdPartial { get; set; } = false;
        public bool bUserIdUnaccessed { get; set; } = false;
        public bool bUserIdPartialUnaccessed { get; set; } = false;
        public bool bPublishOnMain { get; set; } = false;
        public bool PublishOnMain { get; set; } = true;
    }
}
