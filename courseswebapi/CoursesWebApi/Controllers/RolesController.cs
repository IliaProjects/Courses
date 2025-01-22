using CoursesWebApi.Controllers.Attributes;
using CoursesWebApi.Models.Entity;
using CoursesWebApi.Services;
using CoursesWebApi.Services.DomainServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoursesWebApi.Controllers
{
    [Route("api/Roles")]
    public class RolesController : ControllerBase
    {
        RoleService _rolesService;
        public RolesController(RoleService rolesService, UserService userService) : base(userService)
        {
            _rolesService = rolesService;
        }

        [HttpGet("GetRoles")]
        [AuthorizeRole(RoleEnum.DIRECTOR)]
        public IQueryable<Role> GetRoles() 
        { 
            return _rolesService.GetAllRoles();
        }
    }
}
