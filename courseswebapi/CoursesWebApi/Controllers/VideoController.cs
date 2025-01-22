using CoursesWebApi.Services.DomainServices;
using Microsoft.AspNetCore.Mvc;

namespace CoursesWebApi.Controllers
{
    public class VideoController : ControllerBase
    {
        public VideoController(UserService userService) : base(userService)
        {
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
