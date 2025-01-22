using Microsoft.AspNetCore.Http.HttpResults;
using static System.Net.Mime.MediaTypeNames;

namespace CoursesWebApi.Models
{
    public enum SortCoursesByEnum
    {
        DateInc,
        DateDec,
        NameInc,
        NameDec,
    }
    public enum SortUsersByEnum
    {
        NameInc,
        NameDec,
        RegDateInc,
        RegDateDec,
        LastSeenDateInc,
        LastSeenDateDec,
    }
    public enum SortCoursesCatalogByEnum
    {
        DateInc,
        DateDec,
    }
    public enum ShowCoursesCatalogByEnum
    {
        All,
        Accessed,
        Unaccessed,
    }
}
