using CoursesWebApi.Models.Entity;

namespace CoursesWebApi.DataGateway
{
    public class RoleMapper : DataMapperBase, IDataMapper<Role>
    {
        public RoleMapper(AppDbContext appDbContext) : base(appDbContext){}

        public IQueryable<Role> GetAll()
        {
            return _dbContext.Roles;
        }

        public Role Get(int id)
        {
            return _dbContext.Roles.Single(s => s.Id == id);
        }

        public async Task<bool> InsertAsync(Role item)
        {
            _dbContext.Roles.Add(item);
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
                var role = _dbContext.Roles.Single(c => c.Id == id);
                _dbContext.Roles.Remove(role);
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
