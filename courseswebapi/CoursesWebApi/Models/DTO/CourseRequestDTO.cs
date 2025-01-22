namespace CoursesWebApi.Models.DTO
{
    public class CourseRequestDTO
    {
        public string? Email { get; set; }
        public string? PhoneNr { get; set; }
        public string Message {  get; set; }
        public int? CourseId { get; set; }
        public int? SectionId { get; set; }
    }
}
