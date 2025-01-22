using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.UpdateModels;
using Microsoft.EntityFrameworkCore;

namespace CoursesWebApi.DataGateway
{
    public class UserMapper : DataMapperBase, IDataMapper<User>
    {
        public UserMapper(AppDbContext appDbContext) : base(appDbContext){}

        public IQueryable<User> GetAll()
        {
            return _dbContext.Users;
        }

        public User Get(int id)
        {
            return _dbContext.Users.Single(s => s.Id == id);
        }

        public async Task<bool> InsertAsync(User item)
        {
            _dbContext.Users.Add(item);
            return await TryToSaveDataChangesAsync();
        }

        public async Task<bool> UpdateAsync(object item)
        {
            var model = (UserUpdateModel)item;
            var user = _dbContext.Users.Single(d => d.Id == model.UserId);
            if (model.bEmail) {
                user.Email = model.Email;
            }
            if (model.bPhoto) 
            {
                user.Photo = model.Photo != null ? Convert.FromBase64String(model.Photo): null;
            }
            if (model.bPhoneNr) 
            {
                user.PhoneNr = model.PhoneNr;
            }
            if (model.bPassword) 
            {
                user.Password = model.Password;
            }
            if (model.bName) 
            { 
                user.Name = model.Name;
            }
            if (model.bLastName)
            {
                user.LastName = model.LastName;
            }
            if (model.bRoleEnum) {
                user.RoleEnum = model.RoleEnum;
            }
            if (model.bCourseSectionId) {
                user.CourseSections.Add(_dbContext.CourseSections.Single(s => s.Id == model.CourseSectionId));
            }
            if (model.bLastRequest)
            {
                user.lastRequest = model.LastRequest;
            }

            return await TryToSaveDataChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var user = _dbContext.Users.Single(c => c.Id == id);
                _dbContext.Users.Remove(user);
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
