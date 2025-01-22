using CoursesWebApi.DataGateway;
using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.Entity;

namespace CoursesWebApi.Services.DomainServices
{
    public class RoleService
    {
        IDataMapper<User> _userMapper;
        IDataMapper<Role> _roleMapper;

        public RoleService(IDataMapper<Role> roleMapper, IDataMapper<User> userMapper)
        {
            _userMapper = userMapper;
            _roleMapper = roleMapper;
        }

        public IQueryable<Role> GetAllRoles() 
        { 
            return _roleMapper.GetAll();
        }
        public Role GetRole(int id)
        {
            return _roleMapper.Get(id);
        }
        public Role GetRoleByEnum(RoleEnum roleEnum) {
            return _roleMapper.GetAll().Where(w => w.RoleEnum == roleEnum).FirstOrDefault();
        }

        public async Task<bool> SeedRoles()
        {

            foreach (RoleEnum num in Enum.GetValues<RoleEnum>())
            {
                if (num != RoleEnum.GHOST) {
                    await _roleMapper.InsertAsync(
                        new Role
                        {
                            RoleEnum = num,
                            RoleName = Enum.GetName(num)
                        }
                    );
                };
            }
            return true;
        }
    }
}
