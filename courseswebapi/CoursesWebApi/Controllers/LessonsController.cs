using CoursesWebApi.Controllers.Attributes;
using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.DTO;
using CoursesWebApi.Models.SearchModels;
using CoursesWebApi.Models.UpdateModels;
using CoursesWebApi.Services.DomainServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoursesWebApi.Controllers
{
    [Route("api/Lessons")]
    public class LessonsController : ControllerBase
    {
        CourseService _courseService;
        UserService _userService;
        public LessonsController(CourseService courseService, UserService userService) : base(userService)
        {
            _courseService = courseService;
            _userService = userService;
        }

        [HttpGet("Get")]
        [Authorize]
        public IActionResult Get(int id)
        {
            if (!_userService.HasAuthority(RoleEnum.ADMIN))
            {
                if (_courseService.LessonAccessory(id))
                {
                    return Ok(_courseService.GetLesson(id));
                }
                return BadRequest("You have no access to this lesson");
            }
            return Ok(_courseService.GetLesson(id));
        }

        [HttpGet("GetLessonsSection")]
        [Authorize]
        public IActionResult GetLessonsSection(int sectionId)
        {
            if (!_userService.HasAuthority(RoleEnum.ADMIN))
            {
                if (_courseService.CourseSectionAccessory(sectionId))
                {
                    return Ok(_courseService.GetLessonsSection(sectionId));
                }
                return BadRequest("You have no access to this module");
            }
            return Ok(_courseService.GetLessonsSection(sectionId));
        }

        [HttpGet("Getall")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public IQueryable<Lesson> GetAll()
        {
            return _courseService.GetAllLessons();
        }

        [HttpGet("Search")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public IQueryable<Lesson> Search([FromBody] LessonSearchModel model)
        {
            return _courseService.SearchLessons(model);
        }

        [HttpPost("Post")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public async Task<IActionResult> Post([FromBody] UploadLessonRequestDTO model)
        {
            try
            {
                if (await _courseService.UploadLessonAsync(model))
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
        public async Task<IActionResult> Put([FromBody] LessonUpdateModel model)
        {
            try
            {
                if (await _courseService.UpdateLessonAsync(model))
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
                if (await _courseService.DeleteLessonAsync(id))
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
