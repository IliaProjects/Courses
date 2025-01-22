using CoursesWebApi.DataGateway;
using CoursesWebApi.Models.Entity;
using Microsoft.AspNetCore.Components.Web;

namespace CoursesWebApi.Models.SearchModels.SearchFactories
{
    public class UserSearchFactory
    {
        IDataMapper<User> _userMapper;
        public UserSearchFactory(IDataMapper<User> userMapper)
        {
            _userMapper = userMapper;
        }
        public IQueryable<User> newSelection(UserSearchModel searchModel)
        {
            var result = _userMapper.GetAll();

            if (searchModel.bEmailEquals)
            {
                result = result.Where(x => x.Email.Equals(searchModel.Email));
            }
            if (searchModel.bEmailContains)
            {
                result = result.Where(x => x.Email.Contains(searchModel.Email));
            }
            if (searchModel.bPassword)
            {
                result = result.Where(x => x.Password.Equals(searchModel.Password));
            }
            if (searchModel.bName)
            {
                result = result.Where(x => x.Name.Contains(searchModel.Name));
            }
            if (searchModel.bLastName)
            {
                result = result.Where(x => x.LastName.Contains(searchModel.LastName));
            }
            if (searchModel.bRoleEnum)
            {
                result = result.Where(x => x.Role.RoleEnum == searchModel.RoleEnum);
            }
            if (searchModel.bPhoneNr)
            {
                result = result.Where(x => x.PhoneNr.Contains(searchModel.PhoneNr));
            }
            return result;
        }
        public IQueryable<User> newAssociation(UserSearchModel searchModel)
        {   
            var allUsers = _userMapper.GetAll();
            var result = new List<User>();

            if (searchModel.bEmailEquals)
            {
                result = allUsers.Where(x => x.Email.Equals(searchModel.Email)).ToList();
            }
            if (searchModel.bEmailContains)
            {
                result = allUsers.Where(x => x.Email.Contains(searchModel.Email)).ToList();
            }
            if (searchModel.bPassword)
            {
                result.AddRange(allUsers.Where(x => x.Password.Equals(searchModel.Password)));
            }
            if (searchModel.bName)
            {
                result.AddRange(allUsers.Where(x => x.Name.Contains(searchModel.Name)));
            }
            if (searchModel.bLastName)
            {
                result.AddRange(allUsers.Where(x => x.LastName.Contains(searchModel.LastName)));
            }
            if (searchModel.bRoleEnum)
            {
                result.AddRange(allUsers.Where(x => x.Role.RoleEnum == searchModel.RoleEnum));
            }
            if (searchModel.bPhoneNr)
            {
                result.AddRange(allUsers.Where(x => x.PhoneNr.Contains(searchModel.PhoneNr)));
            }
            return result.Distinct().AsQueryable();
        }
    }
}
