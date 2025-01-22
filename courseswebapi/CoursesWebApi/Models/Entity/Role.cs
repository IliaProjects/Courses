using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoursesWebApi.Models.Entity
{
    public enum RoleEnum
    {
        USER,
        ADMIN,
        DIRECTOR,
        GHOST
    }

    public class Role
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public RoleEnum RoleEnum {  get; set; }
        [Required]
        public string RoleName { get; set; }

        public virtual ICollection<User> Users { get; set; } = new List<User>();
        
    }
}
