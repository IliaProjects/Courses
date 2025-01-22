using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.UpdateModels;
using Microsoft.EntityFrameworkCore;


namespace CoursesWebApi.DataGateway
{
    public class CourseMapper : DataMapperBase, IDataMapper<Course>
    {
        public CourseMapper(AppDbContext appDbContext) : base(appDbContext) { }

        public IQueryable<Course> GetAll()
        {
            return _dbContext.Courses;
        }

        public Course Get(int id)
        {
            return _dbContext.Courses.Include(e => e.CourseSections).Single(s => s.Id == id);
        }

        public async Task<bool> InsertAsync(Course item)
        {
            _dbContext.Courses.Add(item);
            return await TryToSaveDataChangesAsync();
        }

        public async Task<bool> UpdateAsync(object item)
        {
            var model = (CourseUpdateModel)item;
            var course = _dbContext.Courses.Single(d => d.Id == model.CourseId);
            if (model.bName)
            {
                course.Name = model.Name;
            }
            if (model.bDescription)
            {
                course.Description = model.Description;
            }
            if (model.bImage)
            {
                course.Image = Convert.FromBase64String(model.Image);
            }
            if (model.bPublishOnMain)
            {
                course.PublishOnMain = !course.PublishOnMain;
            }
            return await TryToSaveDataChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var course = _dbContext.Courses.Single(c => c.Id == id);
                _dbContext.Courses.Remove(course);
                return await TryToSaveDataChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                return false;
            }
        }
    }
}
