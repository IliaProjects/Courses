using CoursesWebApi.DataGateway;
using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.DTO;
using CoursesWebApi.Models.SearchModels;
using CoursesWebApi.Models.SearchModels.SearchFactories;
using CoursesWebApi.Models.UpdateModels;
using System.Linq;
using System.Security.Claims;
using CoursesWebApi.Models;
using System.Globalization;
using static System.Collections.Specialized.BitVector32;

namespace CoursesWebApi.Services.DomainServices
{
    public class CourseService
    {
        IHttpContextAccessor _accessor;
        IDataMapper<Course> _courseMapper;
        IDataMapper<CourseSection> _courseSectionMapper;
        IDataMapper<Lesson> _lessonMapper;
        IDataMapper<LessonVideo> _videoMapper;
        UserService _userService;

        int _userId;
        RoleEnum _userRole;
        public CourseService(IHttpContextAccessor accessor,
            IDataMapper<Course> courseMapper,
            IDataMapper<CourseSection> courseSectionMapper,
            IDataMapper<Lesson> lessonMapper,
            IDataMapper<LessonVideo> videoMapper,
            UserService userService)
        {
            _courseMapper = courseMapper;
            _courseSectionMapper = courseSectionMapper;
            _lessonMapper = lessonMapper;
            _userService = userService;
            _videoMapper = videoMapper;
            _accessor = accessor;
        }

        #region геттеры и сёрчеры

        public Course GetCourse(int id)
        {
            return _courseMapper.Get(id);
        }

        public CourseSection GetCourseSection(int id)
        {
            return _courseSectionMapper.Get(id);
        }

        public Lesson GetLesson(int id)
        {
            return _lessonMapper.Get(id);
        }

        public IQueryable<Course> GetAllCourses(SortCoursesByEnum sortBy)
        {
            var result = SortCourses(_courseMapper.GetAll(), sortBy);
            return result;
        }

        public IQueryable<CourseSection> GetAllCourseSections()
        {
            return _courseSectionMapper.GetAll();
        }

        public IQueryable<Lesson> GetAllLessons()
        {
            return _lessonMapper.GetAll();
        }
        public IQueryable<Lesson> SearchLessons(LessonSearchModel searchModel)
        {
            return new CoursesSearchFactory(_lessonMapper, _courseMapper).newLessonSelection(searchModel);
        }
        public IQueryable<Course> SearchCourses(CourseSearchModel searchModel, SortCoursesByEnum sortBy)
        {
            if(_userService.IsAuthorized() && searchModel.UserId == 0)
                searchModel.UserId = _userService.GetUserId();
            var result = SortCourses(new CoursesSearchFactory(_lessonMapper, _courseMapper).newCourseSelection(searchModel), sortBy);
            return result;
        }
        public IQueryable<CourseSection> SearchCourseSections(CourseSectionSearchModel searchModel, SortCoursesByEnum sortBy)
        {
            var result = SortCourseSections(new CoursesSearchFactory(_courseSectionMapper).newCourseSectionSelection(searchModel), sortBy);
            return result;
        }
        #endregion

        #region сеттеры
        public async Task<bool> UploadCourseAsync(UploadCourseRequestDTO dto)
        {
            var course = new Course()
            {
                Name = dto.Name,
                Description = dto.Description,
                Image = Convert.FromBase64String(dto.Image),
                UploaderId = _userService.GetUserId(),
            };
            if (await _courseMapper.InsertAsync(course))
            {
                var section = new CourseSection()
                {
                    CourseId = course.Id,
                    Name = "default",
                    Image = course.Image,
                    CreatorId = course.UploaderId,
                    Created = DateTime.UtcNow,
                    Order = 0,
                };
                return await _courseSectionMapper.InsertAsync(section);
            }
            else return false;
        }
        public async Task<bool> UploadSectionAsync(UploadSectionRequestDTO dto)
        {
            if(dto.Order == -1)
                dto.Order = _courseSectionMapper.GetAll().Where(c => c.CourseId == dto.CourseId).Max(c => c.Order) + 1;
            var courseSection = new CourseSection()
            {
                Name = dto.Name,
                Description = dto.Description,
                Image = dto.Image,
                CourseId = dto.CourseId,
                CreatorId = _userService.GetUserId(),
                Order = dto.Order,
            };
            return await _courseSectionMapper.InsertAsync(courseSection);
        }

        public async Task<bool> UploadLessonAsync(UploadLessonRequestDTO dto)
        {
            List<LessonVideo> videos = new List<LessonVideo>();
            foreach (var x in dto.lessonVideosIds)
            {
                videos.Add(_videoMapper.Get(x));
            }

            var lesson = new Lesson()
            {
                Name = dto.Name,
                Description = dto.Description,
                Image = dto.Image,
                Content = dto.Content,
                SectionId = dto.SectionId,
                LessonVideos = videos,
                CreatorId = _userService.GetUserId(),
                LastEditorId = _userService.GetUserId(),

            };
            return await _lessonMapper.InsertAsync(lesson);
        }
        #endregion

        #region путтеры

        public async Task<bool> UpdateLessonAsync(LessonUpdateModel model)
        {
            model.EditorId = _userService.GetUserId();
            return await _lessonMapper.UpdateAsync(model);
        }
        public async Task<bool> UpdateCourseAsync(CourseUpdateModel model)
        {
            return await _courseMapper.UpdateAsync(model);
        }
        public async Task<bool> UpdateCourseSectionAsync(CourseSectionUpdateModel model)
        {
            return await _courseSectionMapper.UpdateAsync(model);
        }
        #endregion

        public async Task<bool> DeleteCourseAsync(int id)
        {
            return await _courseMapper.DeleteAsync(id);
        }
        public async Task<bool> DeleteSectionAsync(int id)
        {
            return await _courseSectionMapper.DeleteAsync(id);
        }
        public async Task<bool> DeleteLessonAsync(int id)
        {
            return await _lessonMapper.DeleteAsync(id);
        }

        public bool LessonAccessory(int lessonId)
        {
            return _lessonMapper.Get(lessonId).Section.Users.Any(u => u.Id == _userService.GetUserId());
        }

        public bool CourseSectionAccessory(int courseSectionId)
        {
            return _courseSectionMapper.Get(courseSectionId).Users.Any(u => u.Id == _userService.GetUserId());
        }

        public IQueryable<Lesson> GetLessonsSection(int sectionId) 
        {
            return new CoursesSearchFactory(_lessonMapper, _courseMapper)
                .newLessonSelection(
                new LessonSearchModel
                {
                    bCourseSectionId = true,
                    CourseSectionId = sectionId,
                }
            );
        }

        public IQueryable<Course> SortCourses(IQueryable<Course> courses, SortCoursesByEnum sortBy)
        {
            var result = courses;
            switch (sortBy)
            {
                case SortCoursesByEnum.NameInc:
                    result = result.OrderBy(x => x.Name).ThenBy(x => x.Created);
                    break;
                case SortCoursesByEnum.NameDec:
                    result = result.OrderByDescending(x => x.Name).ThenBy(x => x.Created);
                    break;
                case SortCoursesByEnum.DateInc:
                    result = result.OrderBy(x => x.Created).ThenBy(x => x.Name);
                    break;
                case SortCoursesByEnum.DateDec:
                    result = result.OrderByDescending(x => x.Created).ThenBy(x => x.Name);
                    break;
            }
            return result;
        }

        public IQueryable<CourseSection> SortCourseSections(IQueryable<CourseSection> sections, SortCoursesByEnum sortBy)
        {
            var result = sections;
            /*switch (sortBy)
            {
                case SortСoursesByEnum.NameInc:
                    result = result.OrderBy(x => x.Name).ThenBy(x => x.Created);
                    break;
                case SortСoursesByEnum.NameDec:
                    result = result.OrderByDescending(x => x.Name).ThenBy(x => x.Created);
                    break;
                case SortСoursesByEnum.DateInc:
                    result = result.OrderBy(x => x.Created).ThenBy(x => x.Name);
                    break;
                case SortСoursesByEnum.DateDec:
                    result = result.OrderByDescending(x => x.Created).ThenBy(x => x.Name);
                    break;
            }*/
            result = result.OrderBy(x => x.Order).ThenBy(x => x.Name);
            var resultList = result.ToList();
            var item = resultList.FirstOrDefault(x => x.Name.Equals("default"));
            if (item != null)
            {
                resultList.Remove(item);
                resultList.Insert(0, item);
            }
            var newResult = resultList.AsQueryable();
            return newResult;
        }
        public async Task<bool> OpenAccessToCourse(int userId, int courseId)
        {
            var course = _courseMapper.Get(courseId);
            foreach (var item in course.CourseSections) {
                if (!await _courseSectionMapper.UpdateAsync(
                    new CourseSectionUpdateModel
                    {
                        CourseSectionId = item.Id,
                        User = _userService.GetUser(userId),
                        bOpenAccess = true,
                    }
                )) return false;
            }
            return true;
        }
        public async Task<bool> CloseAccessToCourse(int userId, int courseId)
        {
            var course = _courseMapper.Get(courseId);
            foreach (var item in course.CourseSections)
            {
                if (!await _courseSectionMapper.UpdateAsync(
                    new CourseSectionUpdateModel
                    {
                        CourseSectionId = item.Id,
                        User = _userService.GetUser(userId),
                        bCloseAccess = true,
                    }
                )) return false;
            }
            return true;
        }

        public async Task<bool> OpenAccessToSection(int userId, int sectionId)
        {
            return await _courseSectionMapper.UpdateAsync(
                new CourseSectionUpdateModel {
                    CourseSectionId = sectionId,
                    User = _userService.GetUser(userId),
                    bOpenAccess = true,
                }
            );
        }
        public async Task<bool> CloseAccessToSection(int userId, int sectionId)
        {
            return await _courseSectionMapper.UpdateAsync(
            new CourseSectionUpdateModel
                {
                    CourseSectionId = sectionId,
                    User = _userService.GetUser(userId),
                    bCloseAccess = true,
                }
            );
        }

        public async Task<bool> ReorderSectionAsync(int secId, int position)
        {
            var section = GetCourseSection(secId);
            if (position > 0)
            {
                var allsections = _courseSectionMapper.GetAll().Where(w => w.CourseId == section.CourseId);
                if (section.Order < allsections.Max(s => s.Order))
                {
                    for (int i = 0; i < position; i++)
                    {
                        var targetSection = allsections.FirstOrDefault(s => s.Order == (section.Order + 1));

                        var result = await _courseSectionMapper.UpdateAsync(new CourseSectionUpdateModel()
                        {
                            CourseSectionId = targetSection.Id,
                            Order = section.Order,
                            bOrder = true
                        });

                        result = await _courseSectionMapper.UpdateAsync(new CourseSectionUpdateModel()
                        {
                            CourseSectionId = section.Id,
                            Order = section.Order + 1,
                            bOrder = true
                        });

                        return result;
                    }                    
                }
            }

            if (position < 0)
            {
                var x = section.Order;
                if (section.Order > 1)
                {
                    var allsections = _courseSectionMapper.GetAll().Where(w => w.CourseId == section.CourseId);
                    for (int i = 0; i > position; i--)
                    {
                        var targetSection = allsections.FirstOrDefault(s => s.Order == (section.Order - 1));

                        var result = await _courseSectionMapper.UpdateAsync(new CourseSectionUpdateModel()
                        {
                            CourseSectionId = targetSection.Id,
                            Order = section.Order,
                            bOrder = true
                        });

                        result = await _courseSectionMapper.UpdateAsync(new CourseSectionUpdateModel()
                        {
                            CourseSectionId = section.Id,
                            Order = section.Order - 1,
                            bOrder = true
                        });

                        return result;
                    }
                }
            }

            return false;
        
        }
        /*public async Task<bool> SeedCourses()
        {
            var admin = _userService.SearchUsers(new UserSearchModel() { bEmailContains = true, Email = "admin" }).FirstOrDefault();
            var director = _userService.SearchUsers(new UserSearchModel() { bEmailContains = true, Email = "director" }).FirstOrDefault();

            #region тестовые курсы
            Course danceCourse = new Course()
            {
                Name = "Dance course",
                Description = "This course is about dances.",
                Created = DateTime.UtcNow,
                UploaderId = director.Id,
                CourseSections =
                {
                    new CourseSection() {
                        Name = "HipHop",
                        Description = "This course section is about hip hop",
                        Created = DateTime.UtcNow,
                        CreatorId = director.Id,
                        Lessons =
                        {
                            new Lesson()
                            {
                                Name = "First hiphop lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = director.Id,
                                LastEditorId = director.Id,
                                Content = ""
                            },
                            new Lesson()
                            {
                                Name = "Second hiphop lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = director.Id,
                                LastEditorId = director.Id,
                                Content = ""
                            },
                            new Lesson()
                            {
                                Name = "Third hiphop lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = director.Id,
                                LastEditorId = director.Id,
                                Content = ""
                            },
                        }
                    },
                    new CourseSection() {
                        Name = "Ballroom",
                        Description = "This course section is about ballroom",
                        Created = DateTime.UtcNow,
                        CreatorId = director.Id,
                        Lessons =
                        {
                            new Lesson()
                            {

                                Name = "First ballroom lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = director.Id,
                                LastEditorId = director.Id,
                                Content = ""
                            },
                            new Lesson()
                            {

                                Name = "Second ballroom lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = director.Id,
                                LastEditorId = director.Id,
                                Content = ""
                            },
                            new Lesson()
                            {

                                Name = "Third ballroom lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = director.Id,
                                LastEditorId = director.Id,
                                Content = ""
                            },
                        }
                    }
                }
            };
            Course readingCourse = new Course()
            {
                Name = "Reading course",
                Description = "This course is about Reading.",
                Created = DateTime.UtcNow,
                UploaderId = admin.Id,
                CourseSections =
                {
                    new CourseSection() {
                        Name = "Pushkin",
                        Description = "This course section is about Pushkin",
                        Created = DateTime.UtcNow,
                        CreatorId = admin.Id,
                        Lessons =
                        {
                            new Lesson()
                            {

                                Name = "First Pushkin lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = admin.Id,
                                LastEditorId = admin.Id,
                                Content = ""
                            },
                            new Lesson()
                            {

                                Name = "Second Pushkin lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = admin.Id,
                                LastEditorId = admin.Id,
                                Content = ""
                            },
                            new Lesson()
                            {

                                Name = "Third Pushkin lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = admin.Id,
                                LastEditorId = admin.Id,
                                Content = ""
                            },
                        }
                    },
                    new CourseSection() {
                        Name = "Lermontov",
                        Description = "This course section is about Lermontov",
                        Created = DateTime.UtcNow,
                        CreatorId = admin.Id,
                        Lessons =
                        {
                            new Lesson()
                            {

                                Name = "First Lermontov lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = admin.Id,
                                LastEditorId = admin.Id,
                                Content = ""
                            },
                            new Lesson()
                            {

                                Name = "Second Lermontov lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = admin.Id,
                                LastEditorId = admin.Id,
                                Content = ""
                            },
                            new Lesson()
                            {

                                Name = "Third Lermontov lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = admin.Id,
                                LastEditorId = admin.Id,
                                Content = ""
                            },
                        }
                    }
                }
            };
            Course frenchCourse = new Course()
            {
                Name = "French course",
                Description = "This course is about French.",
                Created = DateTime.UtcNow,
                UploaderId = director.Id,
                CourseSections = 
                {
                    new CourseSection() {
                        Name = "French grammar",
                        Description = "This course section is about French grammar",
                        Created = DateTime.UtcNow,
                        CreatorId = admin.Id,
                        Lessons =
                        {
                            new Lesson()
                            {

                                Name = "First French grammar lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = admin.Id,
                                LastEditorId = admin.Id,
                                Content = ""
                            },
                            new Lesson()
                            {

                                Name = "Second French grammar lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = admin.Id,
                                LastEditorId = admin.Id,
                                Content = ""
                            },
                            new Lesson()
                            {

                                Name = "Third French grammar lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = admin.Id,
                                LastEditorId = admin.Id,
                                Content = ""
                            },
                        }
                    },
                    new CourseSection() {
                        Name = "French speaking",
                        Description = "This course section is about French speaking",
                        Created = DateTime.UtcNow,
                        CreatorId = admin.Id,
                        Lessons =
                        {
                            new Lesson()
                            {

                                Name = "First French speaking lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = admin.Id,
                                LastEditorId = admin.Id,
                                Content = ""
                            },
                            new Lesson()
                            {

                                Name = "Second French speaking lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = admin.Id,
                                LastEditorId = admin.Id,
                                Content = ""
                            },
                            new Lesson()
                            {

                                Name = "Third French speaking lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = admin.Id,
                                LastEditorId = admin.Id,
                                Content = ""
                            },
                        }
                    }
                }
            };

            await _courseMapper.InsertAsync(danceCourse);
            await _courseMapper.InsertAsync(readingCourse);
            await _courseMapper.InsertAsync(frenchCourse);
            #endregion


            var alisa = _userService.SearchUsers(new UserSearchModel() { bEmailContains = true, Email = "admintest" }).FirstOrDefault();
            var igor = _userService.SearchUsers(new UserSearchModel() { bEmailContains = true, Email = "usertest" }).FirstOrDefault();

            Course kovi = new Course()
            {
                Name = "7 Навыков Высокоэффективных Людей",
                Description = "Этот курс на основе книги Стивена Кови представляет собой погружение в фундаментальные принципы личной эффективности и развития. Первый раздел охватывает основы саморазвития, включая установление целей, управление временем и приоритетами, а также развитие эмоционального интеллекта. Второй раздел фокусируется на межличностных навыках, таких как эффективное общение, умение работать в команде и создание синергии через совместную работу.",
                Created = DateTime.UtcNow,
                UploaderId = alisa.Id,
                Image = Convert.FromBase64String(""),
                CourseSections =
            {
                    new CourseSection() {
                        Name = "Перввая часть Семи Навыков",
                        Description = "Первый раздел курса построен на основе ключевых принципов саморазвития, включая постановку целей, эффективное управление временем и приоритетами, а также развитие эмоционального интеллекта для личной продуктивности.",
                        Created = DateTime.UtcNow,
                        CreatorId = alisa.Id,
                        Lessons =
                        {
                            new Lesson()
                            {
                                Name = "First hiphop lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = alisa.Id,
                                LastEditorId = alisa.Id,
                                Content = ""
                            },
                            new Lesson()
                            {
                                Name = "Second hiphop lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = alisa.Id,
                                LastEditorId = alisa.Id,
                                Content = ""
                            },
                            new Lesson()
                            {
                                Name = "Third hiphop lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = alisa.Id,
                                LastEditorId = alisa.Id,
                                Content = ""
                            },
                        }
                    },
                    new CourseSection() {
                        Name = "Вторая часть Семи Навыков",
                        Description = "Второй раздел сосредотачивается на межличностных навыках, обучая эффективному взаимодействию, коллаборации и созданию совместной энергии в групповых процессах.",
                        Created = DateTime.UtcNow,
                        CreatorId = alisa.Id,
                        Lessons =
                        {
                            new Lesson()
                            {

                                Name = "First ballroom lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = alisa.Id,
                                LastEditorId = alisa.Id,
                                Content = ""
                            },
                            new Lesson()
                            {

                                Name = "Second ballroom lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = alisa.Id,
                                LastEditorId = alisa.Id,
                                Content = ""
                            },
                            new Lesson()
                            {

                                Name = "Third ballroom lesson",
                                Created = DateTime.UtcNow,
                                LastEdited = DateTime.UtcNow,
                                CreatorId = alisa.Id,
                                LastEditorId = alisa.Id,
                                Content = ""
                            },
                        }
                    }
                }
            };





            return true;
        }*/
    }
}
