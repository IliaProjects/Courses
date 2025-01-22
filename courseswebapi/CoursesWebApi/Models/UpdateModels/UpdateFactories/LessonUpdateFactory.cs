using CoursesWebApi.DataGateway;
using CoursesWebApi.Models.Entity;
using System.Numerics;

namespace CoursesWebApi.Models.UpdateModels.UpdateFactories
{
    public class LessonUpdateFactory
    {
        Lesson _lesson;
        /*IDataMapper<CourseSection> _courseSectionMapper;
        IDataMapper<Lesson> _lessonMapper;
        IDataMapper<Course> _courseMapper;
        IDataMapper<User> _userMapper;*/
        public LessonUpdateFactory(Lesson lesson/*,
            IDataMapper<Lesson> lessonMapper, 
            IDataMapper<Course> courseMapper,
            IDataMapper<CourseSection> courseSectionMapper,
            IDataMapper<User> userMapper*/) {
            /*_courseMapper = courseMapper;
            _lessonMapper = lessonMapper;
            _courseMapper = courseMapper;
            _userMapper = userMapper;*/
            _lesson = lesson;
        }
        public Lesson update(LessonUpdateModel model)
        {
            if (model.bName)
            {
                _lesson.Name = model.Name;
            }
            if (model.bDescription)
            {
                _lesson.Description = model.Description;
            }
            if (model.bContent)
            {
                _lesson.Content = model.Content;
            }
            if (model.bImage)
            {
                _lesson.Image = Convert.FromBase64String(model.Image);
            }
            if (model.bCourseSectionId)
            {
                _lesson.SectionId = model.CourseSectionId;
            }

            _lesson.LastEdited = DateTime.UtcNow;
            _lesson.LastEditorId = model.EditorId;
            return _lesson;
        }

    }
}
