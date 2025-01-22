using CoursesWebApi.DataGateway;
using CoursesWebApi.Services.DomainServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace CoursesWebApi.Controllers
{
    public class ControllerBase : Controller
    {
        UserService _userService;
        public ControllerBase(UserService userService) 
        {
            _userService = userService;
        }

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (_userService.IsAuthorized())
                await _userService.LogLastRequest();
            await base.OnActionExecutionAsync(context, next);
        }
    }
}
