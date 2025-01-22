using CoursesWebApi.Models.Entity;

namespace CoursesWebApi.DataGateway
{
    public class VideoMapper : DataMapperBase, IDataMapper<LessonVideo>
    {
        public VideoMapper(AppDbContext appDbContext) : base(appDbContext){}

        public IQueryable<LessonVideo> GetAll()
        {
            return _dbContext.LessonVideos;
        }

        public LessonVideo Get(int id)
        {
            return _dbContext.LessonVideos.Single(s => s.Id == id);
        }

        public async Task<bool> InsertAsync(LessonVideo item)
        {
            _dbContext.LessonVideos.Add(item);
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
                var lessonVideo = _dbContext.LessonVideos.Single(c => c.Id == id);
                _dbContext.LessonVideos.Remove(lessonVideo);
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
