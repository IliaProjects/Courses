using CoursesWebApi.Models.DTO;
using CoursesWebApi.Services.DomainServices;
using CoursesWebApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CoursesWebApi.Models.UpdateModels;
using CoursesWebApi.Models.Entity;
using Microsoft.AspNetCore.WebUtilities;

namespace CoursesWebApi.Controllers
{
    [Route("api/Profile")]
    public class ProfileController : ControllerBase
    {
        UserService _userService;
        IHttpContextAccessor _accessor;
        public ProfileController(IHttpContextAccessor accessor, IAuthService authService, UserService userService) : base(userService)
        {
            _userService = userService;
            _accessor = accessor;
        }

        [HttpGet("Get")]
        [Authorize]
        public ProfileResponseDTO Get()
        {
            var claims = _accessor.HttpContext.User.Claims;
            int userId = Convert.ToInt32(_accessor.HttpContext.User.Claims.FirstOrDefault(x => x.Type.Contains("name")).Value);
            return _userService.GetProfile(userId);
        }

        [HttpPut("Edit")]
        [Authorize]
        public async Task<IActionResult> Edit([FromBody] UserUpdateModel model)
        {
            try
            {
                int userId = Convert.ToInt32(_accessor.HttpContext.User.Claims.FirstOrDefault(x => x.Type.Contains("name")).Value);
                model.UserId = userId;
                if (await _userService.UpdateUserAsync(model))
                {
                    return Ok();
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + ex.StackTrace);
                return BadRequest();
            }
        }
    }
}
