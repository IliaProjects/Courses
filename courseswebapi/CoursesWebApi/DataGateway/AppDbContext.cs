using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.UpdateModels;
using CoursesWebApi.Services;
using CoursesWebApi.Services.DomainServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json.Linq;

namespace CoursesWebApi.DataGateway
{
    public class AppDbContext : DbContext
    {
        private static AppDbContext _instance;
        /*public static AppDbContext getInstance()
        {
            if (_instance == null)
                _instance = new AppDbContext();
            return _instance;
        }*/
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseRequest> CourseRequests { get; set; }
        public DbSet<CourseSection> CourseSections { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<LessonVideo> LessonVideos { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            using (StreamReader r = new StreamReader("appsettings.json"))
            {
                string connectionString = JObject.Parse(r.ReadToEnd())["ConnectionStrings"]["PostgresConnection"].Value<string>();
                optionsBuilder.UseNpgsql(connectionString);
            }
        }
        public void EnsureDeleted()
        {
            Database.EnsureDeleted();
        }

        public void EnsureCreated()
        {
            Database.EnsureCreated();
        }
        public void UndoingChangesDbContextLevel()
        {
            foreach (EntityEntry entry in ChangeTracker.Entries())
            {
                switch (entry.State)
                {
                    case EntityState.Modified:
                        entry.State = EntityState.Unchanged;
                        break;
                    case EntityState.Added:
                        entry.State = EntityState.Detached;
                        break;
                    case EntityState.Deleted:
                        entry.Reload();
                        break;
                    default: break;
                }
            }
        }

        async public Task<bool> EnsureSeedData(RoleService roleService, UserService userService)
        {
            return await roleService.SeedRoles() && await userService.SeedUsers();
        }
    }
}
