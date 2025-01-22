using CoursesWebApi.Controllers.Attributes;
using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.DTO;
using CoursesWebApi.Models.SearchModels;
using CoursesWebApi.Models.UpdateModels;
using CoursesWebApi.Services.DomainServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CoursesWebApi.Models;
using CoursesWebApi.Services;

namespace CoursesWebApi.Controllers
{
    public class AccessDTO
    {
        public int UserId { get; set; }
        public List<int> CourseIds { get; set; } = new List<int>();
        public List<int> SectionIds { get; set; } = new List<int>();
    }

    [Route("api/CourseSections")]
    public class CourseSectionsController : ControllerBase
    {

        CourseService _courseService;
        public CourseSectionsController(CourseService courseService, UserService userService) : base(userService)
        {
            _courseService = courseService;
        }

        [HttpGet("Get")]
        [Authorize]
        public CourseSection Get(int id)
        {
            return _courseService.GetCourseSection(id);
        }

        [HttpGet("Getall")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public IQueryable<CourseSection> GetAll()
        {
            return _courseService.GetAllCourseSections();
        }


        [HttpPost("Search")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public object Search([FromBody] CourseSectionSearchModel model, SortCoursesByEnum sortBy, int page)
        {
            var iterator = new PagingIterator<CourseSection>(_courseService.SearchCourseSections(model, sortBy), page);
            var result = new
            {
                sections = iterator.getGroup(),
                pager = iterator.getPager(),
            };
            return result;
        }

        [HttpPost("SearchNoPage")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public object SearchNoPage([FromBody] CourseSectionSearchModel model, SortCoursesByEnum sortBy)
        {
            var result = _courseService.SearchCourseSections(model, sortBy);
            return result;
        }

        [HttpGet("UnauthorizedSearchNoPage")]
        public object UnauthorizedSearch(int courseId, SortCoursesByEnum sortBy)
        {
            var model = new CourseSectionSearchModel
            {
                bCourseId = true,
                CourseId = courseId,
            };
            /*var iterator = new PagingIterator<CourseSection>(_courseService.SearchCourseSections(model, sortBy), page);
            var result = new
            {
                sections = iterator.getGroup(),
                pager = iterator.getPager(),
            };*/
            var result = _courseService.SearchCourseSections(model, sortBy);
            return result;
        }

        [HttpPost("Post")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public async Task<IActionResult> Post([FromBody] UploadSectionRequestDTO model)
        {
            try
            {
                if (await _courseService.UploadSectionAsync(model))
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
        public async Task<IActionResult> Put([FromBody] CourseSectionUpdateModel model)
        {
            try
            {
                if (await _courseService.UpdateCourseSectionAsync(model))
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
                if (await _courseService.DeleteSectionAsync(id))
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

        [HttpPost("OpenAccess")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public async Task<IActionResult> OpenAccess([FromBody] AccessDTO dto)
        {
            try
            {
                if(dto.CourseIds.Any())
                    foreach (var item in dto.CourseIds)
                    {
                        if (!await _courseService.OpenAccessToCourse(dto.UserId, item))
                            return BadRequest();
                    }
                if (dto.SectionIds.Any())
                    foreach (var item in dto.SectionIds)
                    {
                        if (!await _courseService.OpenAccessToSection(dto.UserId, item))
                            return BadRequest();
                    }
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                return BadRequest();
            }
        }

        [HttpPost("CloseAccess")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public async Task<IActionResult> CloseAccess([FromBody] AccessDTO dto)
        {
            try
            {
                foreach (var item in dto.CourseIds)
                {
                    if (!await _courseService.CloseAccessToCourse(dto.UserId, item))
                        return BadRequest();
                }
                foreach (var item in dto.SectionIds)
                {
                    if (!await _courseService.CloseAccessToSection(dto.UserId, item))
                        return BadRequest();
                }
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                return BadRequest();
            }
        }

        [HttpPut("ChangeOrder")]
        [AuthorizeRole(RoleEnum.ADMIN)]
        public async Task<IActionResult> ChangeOrder([FromBody] ChangeOrderDTO model)
        {
            try
            {
                if (await _courseService.ReorderSectionAsync(model.SectionId, model.Position))
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

        public class ChangeOrderDTO
        {
            public int SectionId { get; set; }
            public int Position { get; set; }
        }
    }
}
