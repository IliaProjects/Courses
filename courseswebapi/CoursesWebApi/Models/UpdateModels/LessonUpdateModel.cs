namespace CoursesWebApi.Models.UpdateModels
{
    public class LessonUpdateModel
    {
        public int LessonId { get; set; }
        public string Name { get; set; }
        public bool bName { get; set; } = false;

        public string? Description { get; set; }
        public bool bDescription { get; set; } = false;

        public string? Content { get; set; }
        public bool bContent { get; set; } = false;

        public string? Image { get; set; }
        public bool bImage { get; set; } = false;

        public int CourseId { get; set; }
        public bool bCourseId { get; set; } = false;

        public int CourseSectionId { get; set; }
        public bool bCourseSectionId { get; set; } = false;

        public int EditorId { get; set; }
    }
}
