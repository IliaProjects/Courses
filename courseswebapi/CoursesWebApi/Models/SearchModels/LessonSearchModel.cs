using System.ComponentModel.DataAnnotations;

namespace CoursesWebApi.Models.SearchModels
{
    public class LessonSearchModel
    {
        public string Name { get; set; }
        public bool bNameEquals { get; set; } = false;
        public bool bNameContains { get; set; } = false;
        public DateTime? CreatedFrom { get; set; }
        public bool bCreatedFrom { get; set; } = false;
        public DateTime? CreatedTo { get; set; }
        public bool bCreatedTo { get; set; } = false;
        public DateTime? LastEditedFrom { get; set; }
        public bool bLastEditedFrom { get; set; } = false;
        public DateTime? LastEditedTo { get; set; }
        public bool bLastEditedTo { get; set; } = false;
        public int CourseId { get; set; }
        public bool bCourseId { get; set; } = false;
        public int CourseSectionId { get; set; }
        public bool bCourseSectionId { get; set; } = false;
        public int CreatorId { get; set; }
        public bool bCreatorId { get; set; } = false;
        public int LastEditorId { get; set; }
        public bool bLastEditorId { get; set; } = false;
        public int VideoId { get; set; }
        public bool bVideoId { get; set; } = false;
    }
}
