using CoursesWebApi.Models.Entity;
using Microsoft.EntityFrameworkCore;

namespace CoursesWebApi.DataGateway
{
    public class CourseRequestMapper : DataMapperBase, IDataMapper<CourseRequest>
    {
        public CourseRequestMapper(AppDbContext appDbContext) : base(appDbContext)
        {
        }

        public IQueryable<CourseRequest> GetAll()
        {
            return _dbContext.CourseRequests;
        }

        public CourseRequest Get(int id)
        {
            return _dbContext.CourseRequests.Single(s => s.Id == id);
        }

        public async Task<bool> InsertAsync(CourseRequest item)
        {
            _dbContext.CourseRequests.Add(item);
            return await TryToSaveDataChangesAsync();
        }

        public async Task<bool> UpdateAsync(object item)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var courseRequest = _dbContext.CourseRequests.Single(c => c.Id == id);
                _dbContext.CourseRequests.Remove(courseRequest);
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
