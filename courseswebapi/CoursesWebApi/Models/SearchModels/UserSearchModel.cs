using CoursesWebApi.Models.Entity;

namespace CoursesWebApi.Models.SearchModels
{
    public class UserSearchModel
    {
        public UserSearchModel() { }
        public string? Email { get; set; }
        public bool bEmailEquals { get; set; } = false;
        public bool bEmailContains { get; set; } = false;

        public string Password { get; set; }
        public bool bPassword { get; set; }

        public string? Name { get; set; }
        public bool bName { get; set; } = false;

        public string? LastName { get; set; }
        public bool bLastName { get; set; } = false;

        public string? PhoneNr { get; set; }
        public bool bPhoneNr { get; set; } = false;

        public RoleEnum RoleEnum { get; set; }
        public bool bRoleEnum { get; set; } = false;
    }
}
