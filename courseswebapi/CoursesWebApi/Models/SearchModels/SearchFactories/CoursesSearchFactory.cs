using CoursesWebApi.DataGateway;
using CoursesWebApi.Models.Entity;
using System.Reflection.Metadata.Ecma335;

namespace CoursesWebApi.Models.SearchModels.SearchFactories
{
    public class CoursesSearchFactory
    {
        IDataMapper<Lesson> _lessonMapper;
        IDataMapper<Course> _courseMapper;
        IDataMapper<CourseSection> _sectionMapper;
        public CoursesSearchFactory(IDataMapper<Lesson> lessonMapper, IDataMapper<Course> courseMapper)
        {
            _lessonMapper = lessonMapper;
            _courseMapper = courseMapper;
        }
        public CoursesSearchFactory(IDataMapper<CourseSection> courseSectionMapper)
        {
            _sectionMapper = courseSectionMapper;
        }

        public IQueryable<Lesson> newLessonSelection(LessonSearchModel searchModel)
        {
            var result = _lessonMapper.GetAll();

            if (searchModel.bNameEquals)
            {
                result = result?.Where(w => w.Name.Equals(searchModel.Name));
            }
            if (searchModel.bNameEquals)
            {
                result = result?.Where(w => w.Name.Contains(searchModel.Name));
            }
            if (searchModel.bCreatedFrom)
            {
                result = result?.Where(x => x.Created >= searchModel.CreatedFrom);
            }
            if (searchModel.bCreatedTo)
            {
                result = result?.Where(x => x.Created <= searchModel.CreatedTo);
            }
            if (searchModel.bLastEditedFrom)
            {
                result = result?.Where(x => x.LastEdited >= searchModel.LastEditedFrom);
            }
            if (searchModel.bLastEditedTo)
            {
                result = result?.Where(x => x.LastEdited <= searchModel.LastEditedTo);
            }
            if (searchModel.bCourseId)
            {
                var course = _courseMapper.Get(searchModel.CourseId);
                var _result = Enumerable.Empty<Lesson>().AsQueryable();
                foreach (var item in course.CourseSections)
                {
                    foreach (var lesson in item.Lessons)
                        if(result != null)
                            if (result.Any(a => a.Id == lesson.Id))
                                _result.Append(lesson);
                }
            }
            if (searchModel.bCourseSectionId)
            {
                result = result?.Where(w => w.SectionId == searchModel.CourseSectionId);
            }
            if (searchModel.bCreatorId)
            {
                result = result?.Where(w => w.CreatorId == searchModel.CreatorId);
            }
            if (searchModel.bLastEditorId)
            {
                result = result?.Where(w => w.LastEditorId == searchModel.LastEditorId);
            }
            if (searchModel.bVideoId)
                result = result?.Where(w => w.LessonVideos.Any(x => x.Id == searchModel.VideoId));

            return result;
        }
        public IQueryable<Course> newCourseSelection(CourseSearchModel searchModel)
        {
            var result = _courseMapper.GetAll();

            if (searchModel.bNameEquals)
            {
                result = result.Where(x => x.Name.ToLower().Equals(searchModel.Name.ToLower()));
            }
            if (searchModel.bNameContains)
            {
                result = result.Where(x => x.Name.ToLower().Contains(searchModel.Name.ToLower()));
            }
            if (searchModel.bCreatedFrom)
            {
                result = result.Where(x => x.Created >= searchModel.CreatedFrom);
            }
            if (searchModel.bCreatedTo)
            {
                result = result.Where(x => x.Created <= searchModel.CreatedTo);
            }
            if (searchModel.bUploaderId)
            {
                result = result.Where(x => x.UploaderId ==  searchModel.UploaderId);
            }
            if (searchModel.bCourseSectionId)
            {
                result = result.Where(x => x.CourseSections.Any(c => c.Id == searchModel.CourseSectionId));
                //result = result.Where(x => x.CourseSections.Any(c => c.CreatorId == searchModel.UploaderId));
            }
            if (searchModel.bLessonId)
            {
                int id = searchModel.LessonId;
                var lesson = _lessonMapper.Get(id);
                result = result.Where(w => w.Id == lesson.Section.CourseId);
            }
            if (searchModel.bUserId)
            {
                result = result.Where(w => w.CourseSections.Any(c => c.Users.Any(u => u.Id == searchModel.UserId)));
            }
            if (searchModel.bUserIdPartialUnaccessed)
            {
                result = result.Where(w => w.CourseSections.Any(c => !c.Users.Any(u => u.Id == searchModel.UserId)));
            }
            if (searchModel.bUserIdUnaccessed)
            {
                result = result.Where(w => !w.CourseSections.Any(c => c.Users.Any(u => u.Id == searchModel.UserId)));
            }
            if (searchModel.bPublishOnMain)
            {
                result = result.Where(w => w.PublishOnMain == searchModel.PublishOnMain);
            }

            return result;
        }
        public IQueryable<CourseSection> newCourseSectionSelection(CourseSectionSearchModel searchModel)
        {
            var result = _sectionMapper.GetAll();


            if (searchModel.bNameEquals)
            {
                result = result.Where(x => x.Name.Equals(searchModel.Name));
            }

            if (searchModel.bNameContains)
            {
                result = result.Where(x => x.Name.Contains(searchModel.Name));
            }

            if (searchModel.bCreatedFrom)
            {
                result = result.Where(x => x.Created >= searchModel.CreatedFrom);
            }

            if (searchModel.bCreatedTo)
            {
                result = result.Where(x => x.Created <= searchModel.CreatedTo);
            }

            if (searchModel.bCourseId)
            {
                result = result.Where(x => x.CourseId == searchModel.CourseId);
            }
            if (searchModel.bCreatorId)
            {
                result = result.Where(x => x.CreatorId == searchModel.CreatorId);
            }

            if (searchModel.bLessonId)
            {
                result = result.Where(x => x.Lessons.Any(y => y.Id == searchModel.LessonId));
            }

            if (searchModel.bUserId)
            {
                result = result.Where(x => x.Users.Any(y => y.Id == searchModel.UserId));
            }

            if (searchModel.bUserIdUnaccessed)
            {
                result = result.Where(x => !x.Users.Any(y => y.Id == searchModel.UserId));
            }

            return result;
        }
    }
}
