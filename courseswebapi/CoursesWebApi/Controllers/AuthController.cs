using CoursesWebApi.Controllers.Attributes;
using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.DTO;
using CoursesWebApi.Services;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.IdentityModel.Tokens;

namespace CoursesWebApi.Controllers
{
    [Route("api/Auth")]
    public class AuthController : Controller
    {
        IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO model)
        {
            var loginResponse = await _authService.Login(model);
            if(loginResponse == null || string.IsNullOrEmpty(loginResponse.Token)) 
                return BadRequest(new { message = "Неверный адрес эл. почты или пароль" });
            return Ok(loginResponse);
        }

        [AuthorizeRole(RoleEnum.ADMIN)]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationRequestDTO model)
        {
            if (!_authService.IsUniqueUser(model.Email))
            {
                return BadRequest(new { message = "Email already exists" });
            }
            var user = await _authService.Register(model);
            if (user == null)
            {
                return BadRequest(new { message = "Error while registering" });
            }
            return Ok();
        }
    }
}
