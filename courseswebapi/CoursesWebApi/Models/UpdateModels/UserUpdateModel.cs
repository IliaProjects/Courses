using CoursesWebApi.Models.Entity;

namespace CoursesWebApi.Models.UpdateModels
{
    public class UserUpdateModel
    {
        public int UserId { get; set; }
        
        public string? Email { get; set; }
        public bool bEmail { get; set; } = false;
        
        public string? Photo { get; set; }
        public bool bPhoto { get; set; } = false;
        
        public string? PhoneNr { get; set; }
        public bool bPhoneNr { get; set; } = false;
        
        public string? Password { get; set; }
        public bool bPassword { get; set; }
        
        public string? Name { get; set; }
        public bool bName { get; set; } = false;
        
        public string? LastName { get; set; }
        public bool bLastName { get; set; } = false;
       
        public RoleEnum RoleEnum { get; set; }
        public bool bRoleEnum { get; set; } = false;
     
        public int CourseSectionId { get; set; }
        public bool bCourseSectionId { get; set; } = false;

        public DateTime LastRequest { get; set; } = DateTime.UtcNow;
        public bool bLastRequest { get; set; } = false;
    }
}
