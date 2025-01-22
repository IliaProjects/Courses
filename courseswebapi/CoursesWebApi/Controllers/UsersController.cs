using CoursesWebApi.Controllers.Attributes;
using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.DTO;
using CoursesWebApi.Models.SearchModels;
using CoursesWebApi.Models.UpdateModels;
using CoursesWebApi.Services;
using CoursesWebApi.Services.DomainServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CoursesWebApi.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
namespace CoursesWebApi.Controllers
{
    [Route("api/Users")]
    public class UsersController : ControllerBase
    {
        UserService _userService;
        IAuthService _authService;
        IHttpContextAccessor _accessor;
        public UsersController(IHttpContextAccessor accessor, IAuthService authService, UserService userService) : base(userService)
        {
            _userService = userService;
            _authService = authService;
            _accessor = accessor;
        }

        [HttpGet("Get")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public User Get(int id)
        {
            return _userService.GetUser(id);
        }

        [HttpGet("GetAll")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public object GetAll(bool adminsFirst, SortUsersByEnum sortBy, int page)
        {
            var searchedUsers = _userService.SortUsers(_userService.GetAllUsers(), sortBy, adminsFirst);
            var iterator = new PagingIterator<User>(searchedUsers, page);
            var result = new
            {
                users = iterator.getGroup(),
                pager = iterator.getPager()
            };
            return result;
        }

        [HttpPost("Search")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public object Search([FromBody]UserSearchModel model, bool selection, bool adminsFirst, SortUsersByEnum sortBy, int page, bool usersOnly = false)
        {
            var searchedUsers = _userService.SearchUsers(model, selection, usersOnly);
            var sortedUsers = _userService.SortUsers(searchedUsers, sortBy, adminsFirst);
            var iterator = new PagingIterator<User>(sortedUsers, page);
            var result = new
            {
                users = iterator.getGroup(),
                pager = iterator.getPager()
            };
            var x = result.users.Select(s => s.Email);
            return result;
        }

        [HttpPost("Post")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public async Task<IActionResult> Post([FromBody] RegistrationRequestDTO model)
        {
            try
            {
                if (_authService.IsUniqueUser(model.Email))
                {
                    await _authService.Register(model);
                    return Ok();
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                return BadRequest();
            }
        }

        [HttpPut("Put")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public async Task<IActionResult> Put([FromBody] UserUpdateModel model)
        {
            try
            {
                if (await _userService.UpdateUserAsync(model))
                {
                    return Ok();
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                return BadRequest();
            }
        }

        [HttpDelete("Delete")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (await _userService.DeleteUserAsync(id))
                {
                    return Ok();
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                return BadRequest();
            }
        }

    }
}
