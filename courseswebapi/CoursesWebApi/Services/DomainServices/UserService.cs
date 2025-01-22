using CoursesWebApi.DataGateway;
using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.SearchModels.SearchFactories;
using CoursesWebApi.Models.SearchModels;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.HttpResults;
using CoursesWebApi.Models.DTO;
using CoursesWebApi.Models.UpdateModels;
using CoursesWebApi.Models.Entity;
using System.Globalization;
using CoursesWebApi.Models;

namespace CoursesWebApi.Services.DomainServices
{
    public class UserService
    {
        IHttpContextAccessor _accessor;
        IDataMapper<User> _userMapper;
        IDataMapper<Role> _roleMapper;
        IDataMapper<Course> _coursesMapper;
        IDataMapper<Lesson> _lessonMapper;

        public UserService(IHttpContextAccessor accessor, IDataMapper<User> userMapper,
        IDataMapper<Lesson> lessonMapper, IDataMapper<Role> roleMapper, IDataMapper<Course> coursesMapper)
        {
            _userMapper = userMapper;
            _roleMapper = roleMapper;
            _coursesMapper = coursesMapper;
            _accessor = accessor;
            _lessonMapper = lessonMapper;
            
        }

        public User GetUser(int id)
        {
            return _userMapper.Get(id);
        }

        public IQueryable<User> GetAllUsers()
        {
            return _userMapper.GetAll();
        }
        public IQueryable<User> SearchUsers(UserSearchModel model, bool select, bool usersOnly = false) // TODO
        {
            if (usersOnly && select == false)
            {

                model.bRoleEnum = false;
                var list = new UserSearchFactory(_userMapper).newAssociation(model);
                return list.Where(w => w.RoleEnum == model.RoleEnum);
            }

            if (select)
            {
                return new UserSearchFactory(_userMapper).newSelection(model);
            }
            else
            {

                return new UserSearchFactory(_userMapper).newAssociation(model);
            }
        }
        public IQueryable<User> SortUsers(IQueryable<User> users, SortUsersByEnum sortBy, bool adminsFirst)
        {
            if (adminsFirst)
            {
                var directors = users.Where(w => w.RoleEnum == RoleEnum.DIRECTOR);
                var admins = users.Where(w => w.RoleEnum == RoleEnum.ADMIN);
                var ussers = users.Where(w => w.RoleEnum == RoleEnum.USER);
                var result = new List<User>();
                switch (sortBy)
                {
                    case SortUsersByEnum.NameInc:
                        result = directors.OrderBy(x => x.Name).ThenBy(x => x.LastName).ThenBy(x => x.lastRequest).ToList();
                        result.AddRange(admins.OrderBy(x => x.Name).ThenBy(x => x.LastName).ThenBy(x => x.lastRequest));
                        result.AddRange(users.OrderBy(x => x.Name).ThenBy(x => x.LastName).ThenBy(x => x.lastRequest));
                        break;
                    case SortUsersByEnum.NameDec:
                        result = directors.OrderByDescending(x => x.Name).ThenByDescending(x => x.LastName).ThenBy(x => x.lastRequest).ToList();
                        result.AddRange(admins.OrderByDescending(x => x.Name).ThenByDescending(x => x.LastName).ThenBy(x => x.lastRequest));
                        result.AddRange(users.OrderByDescending(x => x.Name).ThenByDescending(x => x.LastName).ThenBy(x => x.lastRequest));
                        break;
                    case SortUsersByEnum.RegDateInc:
                        result = directors.OrderBy(x => x.RegDate).ThenBy(x => x.lastRequest).ToList();
                        result.AddRange(admins.OrderBy(x => x.RegDate).ThenBy(x => x.lastRequest));
                        result.AddRange(users.OrderBy(x => x.RegDate).ThenBy(x => x.lastRequest));
                        break;
                    case SortUsersByEnum.RegDateDec:
                        result = directors.OrderByDescending(x => x.RegDate).ThenByDescending(x => x.lastRequest).ToList();
                        result.AddRange(admins.OrderByDescending(x => x.RegDate).ThenByDescending(x => x.lastRequest));
                        result.AddRange(users.OrderByDescending(x => x.RegDate).ThenByDescending(x => x.lastRequest));
                        break;
                    case SortUsersByEnum.LastSeenDateInc:
                        result = directors.OrderBy(x => x.lastRequest).ThenBy(x => x.Name).ThenBy(x => x.LastName).ToList();
                        result.AddRange(admins.OrderBy(x => x.lastRequest).ThenBy(x => x.Name).ThenBy(x => x.LastName));
                        result.AddRange(users.OrderBy(x => x.lastRequest).ThenBy(x => x.Name).ThenBy(x => x.LastName));
                        break;
                    case SortUsersByEnum.LastSeenDateDec:
                        result = directors.OrderByDescending(x => x.lastRequest).ThenByDescending(x => x.Name).ThenByDescending(x => x.LastName).ToList();
                        result.AddRange(admins.OrderByDescending(x => x.lastRequest).ThenByDescending(x => x.Name).ThenByDescending(x => x.LastName));
                        result.AddRange(users.OrderByDescending(x => x.lastRequest).ThenByDescending(x => x.Name).ThenByDescending(x => x.LastName));
                        break;
                }
                return result.Distinct().AsQueryable();
            }
            else
            {
                var result = users;
                switch (sortBy)
                {
                    case SortUsersByEnum.NameInc:
                        result = result.OrderBy(x => x.Name).ThenBy(x => x.LastName).ThenBy(x => x.lastRequest);
                        break;
                    case SortUsersByEnum.NameDec:
                        result = result.OrderByDescending(x => x.Name).ThenByDescending(x => x.LastName).ThenBy(x => x.lastRequest);
                        break;
                    case SortUsersByEnum.RegDateInc:
                        result = result.OrderBy(x => x.RegDate).ThenBy(x => x.lastRequest);
                        break;
                    case SortUsersByEnum.RegDateDec:
                        result = result.OrderByDescending(x => x.RegDate).ThenByDescending(x => x.lastRequest);
                        break;
                    case SortUsersByEnum.LastSeenDateInc:
                        result = result.OrderBy(x => x.lastRequest).ThenBy(x => x.Name).ThenBy(x => x.LastName);
                        break;
                    case SortUsersByEnum.LastSeenDateDec:
                        result = result.OrderByDescending(x => x.lastRequest).ThenByDescending(x => x.Name).ThenByDescending(x => x.LastName);
                        break;
                }
                return result;
            }
        }
        public async Task<bool> InsertUserAsync(User user)
        {
            return await _userMapper.InsertAsync(user);
        }

        public async Task<bool> UpdateUserAsync(UserUpdateModel model)
        {
            return await _userMapper.UpdateAsync(model);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            return await _userMapper.DeleteAsync(id);
        }
        public int GetUserId ()
        {
            var claims = _accessor.HttpContext.User.Claims;
            int userId = Convert.ToInt32(claims.FirstOrDefault(x => x.Type.Contains("name")).Value);
            return userId;
        }
        public RoleEnum GetUserRole ()
        {
            var claims = _accessor.HttpContext.User.Claims;
            var rolestring = claims.FirstOrDefault(x => x.Type.Contains("role")).Value;
            return (RoleEnum)Enum.Parse(typeof(RoleEnum), rolestring);
        }

        public bool IsAuthorized()
        {
            return _accessor.HttpContext.User.Identity.IsAuthenticated;
        }

        public bool HasAuthority(RoleEnum minimalRoleEnum)
        {
            var claims = _accessor.HttpContext.User.Claims;//ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            var userRole = claims.FirstOrDefault(x => x.Type.Contains("role")).Value;
            var userRoleEnum = Enum.Parse(typeof(RoleEnum), userRole);
            return (int)userRoleEnum >= (int)minimalRoleEnum;
        }

        public ProfileResponseDTO GetProfile(int id)
        {
            //var claims = ClaimsPrincipal.Current.Identities.First().Claims.ToList();
            //var userId = Convert.ToInt32(claims.FirstOrDefault(x => x.Type.Contains("name")).Value);
            var user = _userMapper.Get(id);
            return new ProfileResponseDTO
            {
                Email = user.Email,
                LastName = user.LastName,
                Name = user.Name,
                PhoneNr = user.PhoneNr,
                RoleEnum = user.RoleEnum,
                RegDate = user.RegDate,
                Photo = user.Photo != null ? Convert.ToBase64String(user.Photo) : "",// System.Text.Encoding.UTF8.GetString(user.Photo) : "",
                Courses = user.RoleEnum == RoleEnum.USER ?
                new CoursesSearchFactory(_lessonMapper, _coursesMapper)
                    .newCourseSelection(new CourseSearchModel {
                        bUserId = true,
                        UserId = user.Id,
                    }) :
                    _coursesMapper.GetAll(),
            };
        }

        public async Task<bool> LogLastRequest()
        {
            return await _userMapper.UpdateAsync(new UserUpdateModel()
            {
                UserId = GetUserId(),
                bLastRequest = true,
                LastRequest = DateTime.UtcNow,
            });
        }


        public async Task<bool> SeedUsers() {

            bool directorInserted = await _userMapper.InsertAsync(new User
            {
                Email = "director@test",
                Password = "Director001",
                Role = _roleMapper.GetAll().Where(w => w.RoleEnum == RoleEnum.DIRECTOR).FirstOrDefault(),
                RoleEnum = RoleEnum.DIRECTOR
            });

            /*bool adminInserted = await _userMapper.InsertAsync(new User
            {
                Email = "director2@test",
                Password = "Ansuya001",
                LastName = "Администратор",
                Role = _roleMapper.GetAll().Where(w => w.RoleEnum == RoleEnum.DIRECTOR).FirstOrDefault(),
                RoleEnum = RoleEnum.DIRECTOR
            });*/

            return directorInserted; //&& adminInserted;
        }


        public async Task<bool> SeedUsersTest()
        {
            await _userMapper.InsertAsync(new User
            {
                Email = "director@test.com",
                Password = "112233",
                Role = _roleMapper.GetAll().Where(w => w.RoleEnum == RoleEnum.DIRECTOR).FirstOrDefault(),
                RoleEnum = RoleEnum.DIRECTOR
            });
            await _userMapper.InsertAsync(new User
            {
                Email = "admin@test.com",
                Password = "112233",
                Role = _roleMapper.GetAll().Where(w => w.RoleEnum == RoleEnum.ADMIN).FirstOrDefault(),
                RoleEnum = RoleEnum.ADMIN
            });
            await _userMapper.InsertAsync(new User
            {
                Email = "test@test.com",
                Password = "112233",
                Role = _roleMapper.GetAll().Where(w => w.RoleEnum == RoleEnum.USER).FirstOrDefault(),
                RoleEnum = RoleEnum.USER
            });


            await _userMapper.InsertAsync(new User
            {
                Email = "string",
                Password = "string",
                Role = _roleMapper.GetAll().Where(w => w.RoleEnum == RoleEnum.DIRECTOR).FirstOrDefault(),
                RoleEnum = RoleEnum.DIRECTOR
            });





            await _userMapper.InsertAsync(new User
            {
                Email = "usertest@gmail.com",
                Password = "usertest",
                Name = "Петренко",
                LastName = "Игорь",
                PhoneNr = "079XXXXXX",
                Role = _roleMapper.GetAll().Where(w => w.RoleEnum == RoleEnum.USER).FirstOrDefault(),
                RoleEnum = RoleEnum.USER
            });

            await _userMapper.InsertAsync(new User
            {
                Email = "admintest@gmail.com",
                Password = "admintest",
                Name = "Рябинина",
                LastName = "Алиса",
                PhoneNr = "069XXXXXX",
                Role = _roleMapper.GetAll().Where(w => w.RoleEnum == RoleEnum.DIRECTOR).FirstOrDefault(),
                RoleEnum = RoleEnum.DIRECTOR
            });

            return true;
        }
        public async Task<bool> SeedUsersTest2()
        {
            await _userMapper.InsertAsync(new User
            {
                Email = "admin2@test",
                Password = "1",
                Role = _roleMapper.GetAll().Where(w => w.RoleEnum == RoleEnum.ADMIN).FirstOrDefault(),
                RoleEnum = RoleEnum.ADMIN
            });
            await _userMapper.InsertAsync(new User
            {
                Email = "admin3@test",
                Password = "1",
                Role = _roleMapper.GetAll().Where(w => w.RoleEnum == RoleEnum.ADMIN).FirstOrDefault(),
                RoleEnum = RoleEnum.ADMIN
            });
            for (int i = 0; i < 150; i++)
            {
                await _userMapper.InsertAsync(new User
                {
                    Email = "test" + i + "@test",
                    Password = "1",
                    Role = _roleMapper.GetAll().Where(w => w.RoleEnum == RoleEnum.USER).FirstOrDefault(),
                    RoleEnum = RoleEnum.USER
                });
            }


            await _userMapper.InsertAsync(new User
            {
                Email = "string",
                Password = "string",
                Role = _roleMapper.GetAll().Where(w => w.RoleEnum == RoleEnum.DIRECTOR).FirstOrDefault(),
                RoleEnum = RoleEnum.DIRECTOR
            });

            return true;
        }
    }
}
