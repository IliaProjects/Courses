using Microsoft.EntityFrameworkCore.Storage;
using System.Buffers.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoursesWebApi.Models.Entity
{
    public class CourseSection
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public byte[]? Image { get; set; }
        public string Description { get; set; } = string.Empty;
        [Required]
        public DateTime Created { get; set; } = DateTime.UtcNow;
        [Required]
        public int Order { get; set; }
        [Required]
        public int CourseId { get; set; }
        [Required]
        public int CreatorId { get; set; }
        [Required]
        public virtual Course Course { get; set; }
        //[Required]
        //public virtual User Creator { get; set; }
        public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
        public virtual ICollection<User> Users { get; set; } = new List<User>();

    }
}
