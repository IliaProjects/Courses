using CoursesWebApi.Controllers.Attributes;
using CoursesWebApi.DataGateway;
using CoursesWebApi.Models;
using CoursesWebApi.Models.DTO;
using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.SearchModels;
using CoursesWebApi.Services;
using CoursesWebApi.Services.DomainServices;
using Microsoft.AspNetCore.Mvc;

namespace CoursesWebApi.Controllers
{
    [Route("api/CourseRequests")]
    public class CourseRequestsController : ControllerBase
    {
        IHttpContextAccessor _accessor;
        IDataMapper<CourseRequest> _courseRequestMapper;
        UserService _userService;
        public CourseRequestsController(UserService userService, 
            IDataMapper<CourseRequest> courseRequestMapper,
            IHttpContextAccessor accessor) : base(userService)
        {
            _accessor = accessor;
            _courseRequestMapper = courseRequestMapper;
            _userService = userService;            
        }

        [HttpGet("Get")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public CourseRequest Get(int id)
        {
            return _courseRequestMapper.Get(id);
        }

        [HttpGet("Getall")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public object GetAll(int page, SortCoursesByEnum sortBy = SortCoursesByEnum.DateDec)
        {
            var iterator = new PagingIterator<CourseRequest>(_courseRequestMapper.GetAll().AsQueryable(), page);
            var result = new
            {
                courses = iterator.getGroup(),
                pager = iterator.getPager()
            }; 
            return result;
        }

        [HttpPost("Post")]
        public async Task<IActionResult> Post([FromBody] CourseRequestDTO model)
        {
            try
            {
                var request = new CourseRequest
                {
                    Message = model.Message,
                    CourseId = model.CourseId,
                    SectionId = model.SectionId,
                };
                if (_accessor.HttpContext.User.Identity.IsAuthenticated == true)
                {
                    var profile = _userService.GetProfile(_userService.GetUserId());
                    request.Email = profile.Email;
                    request.PhoneNr = profile.PhoneNr;
                }
                else
                {
                    request.Email = model.Email;
                    request.PhoneNr = model.PhoneNr;
                }
                if (await _courseRequestMapper.InsertAsync(request))
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
