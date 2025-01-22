namespace CoursesWebApi.Models.UpdateModels
{
    public class CourseUpdateModel
    {
        public int CourseId { get; set; }

        public string? Name { get; set; }
        public bool bName { get; set; } = false;

        public string? Description { get; set; }
        public bool bDescription { get; set; } = false;

        public string? Image { get; set; }
        public bool bImage { get; set; } = false;

        public bool bPublishOnMain { get; set; } = false;
    }
}
