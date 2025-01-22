using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.UpdateModels;
using CoursesWebApi.Models.UpdateModels.UpdateFactories;

namespace CoursesWebApi.DataGateway
{
    public class LessonMapper : DataMapperBase, IDataMapper<Lesson>
    {
        public LessonMapper(AppDbContext appDbContext) : base(appDbContext){}

        public IQueryable<Lesson> GetAll()
        {
            return _dbContext.Lessons;
        }

        public Lesson Get(int id)
        {
            return _dbContext.Lessons.Single(s => s.Id == id);
        }

        public async Task<bool> InsertAsync(Lesson item)
        {
            _dbContext.Lessons.Add(item);
            return await TryToSaveDataChangesAsync();
        }

        public async Task<bool> UpdateAsync(object item)
        {
            var model = (LessonUpdateModel)item;
            var lesson = _dbContext.Lessons.Single(d => d.Id == model.LessonId);
            new LessonUpdateFactory(lesson).update(model);
            return await TryToSaveDataChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var lesson = _dbContext.Lessons.Single(c => c.Id == id);
                _dbContext.Lessons.Remove(lesson);
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
