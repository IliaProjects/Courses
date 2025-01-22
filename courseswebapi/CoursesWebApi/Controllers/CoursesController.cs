using CoursesWebApi.Controllers.Attributes;
using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.DTO;
using CoursesWebApi.Models.SearchModels;
using CoursesWebApi.Models.UpdateModels;
using CoursesWebApi.Services;
using CoursesWebApi.Services.DomainServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CoursesWebApi.Models;

namespace CoursesWebApi.Controllers
{
    [Route("api/Courses")]
    public class CoursesController : ControllerBase
    {
        CourseService _courseService;
        public CoursesController(CourseService courseService, UserService userService) : base(userService)
        {
            _courseService = courseService;
        }

        [HttpGet("Get")]
        [Authorize]
        public Course Get(int id)
        {
            return _courseService.GetCourse(id);
        }

        [HttpPost("Search")]
        /*[Authorize]*/
        public object Search([FromBody] CourseSearchModel model, int page, SortCoursesByEnum sortBy)
        {
            var iterator = new PagingIterator<Course>(_courseService.SearchCourses(model, sortBy), page);
            var result = new
            {
                courses = iterator.getGroup(),
                pager = iterator.getPager()
            };
            return result;
        }

        [HttpGet("Getall")]
        [Authorize]
        public object GetAll(int page, SortCoursesByEnum sortBy)
        {
            var iterator = new PagingIterator<Course>(_courseService.GetAllCourses(sortBy), page);
            var result = new
            {
                courses = iterator.getGroup(),
                pager = iterator.getPager()
            };
            return result;
        }

        [HttpPost("Post")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public async Task<IActionResult> Post([FromBody]UploadCourseRequestDTO model)
        {
            try
            {
                /* for (int i = 0; i < 10; i++)
                {
                    await _courseService.UploadCourseAsync(model);
                } */
                if (await _courseService.UploadCourseAsync(model))
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

        [HttpPut("Put")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public async Task<IActionResult> Put([FromBody] CourseUpdateModel model)
        {
            try
            {
                if (await _courseService.UpdateCourseAsync(model))
                {
                    return Ok();
                }
                return BadRequest();
            }
            catch (Exception ex)
            { 
                Console.WriteLine(ex.Message+ " " + ex.StackTrace);
                return BadRequest();
            }
        }

        [HttpDelete("Delete")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (await _courseService.DeleteCourseAsync(id))
                {
                    return Ok();
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message+ " " + ex.StackTrace);
                return BadRequest();
            }
        }
    }
}
