using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.UpdateModels;
using Microsoft.EntityFrameworkCore;

namespace CoursesWebApi.DataGateway
{
    public class CourseSectionMapper : DataMapperBase, IDataMapper<CourseSection>
    {
        public CourseSectionMapper(AppDbContext context) : base(context) { }

        public IQueryable<CourseSection> GetAll()
        {
            return _dbContext.CourseSections;
        }

        public CourseSection Get(int id)
        {
            var x = _dbContext.CourseSections.Single(s => s.Id == id);
            return x;
        }

        public async Task<bool> InsertAsync(CourseSection item)
        {
            _dbContext.CourseSections.Add(item);
            return await TryToSaveDataChangesAsync();
        }

        public async Task<bool> UpdateAsync(object item)
        {
            
            var model = (CourseSectionUpdateModel)item;
            var courseSection = _dbContext.CourseSections.Include(i => i.Users).Single(d => d.Id == model.CourseSectionId);

            if (model.bName)
            {
                courseSection.Name = model.Name;
            }
            if (model.bDescription)
            {
                courseSection.Description = model.Description;
            }
            if (model.bImage)
            {
                courseSection.Image = Convert.FromBase64String(model.Image);
            }
            if (model.bCourseId)
            {
                courseSection.CourseId = Convert.ToInt32(model.CourseId);
            }
            if (model.bOpenAccess)
            {
                courseSection.Users.Add(model.User);
            }
            if (model.bCloseAccess)
            {
                courseSection.Users.Remove(model.User);
            }
            if (model.bOrder)
            {
                courseSection.Order = model.Order;
            }
            return await TryToSaveDataChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var courseSection = _dbContext.CourseSections.Single(c => c.Id == id);
                _dbContext.CourseSections.Remove(courseSection);
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
