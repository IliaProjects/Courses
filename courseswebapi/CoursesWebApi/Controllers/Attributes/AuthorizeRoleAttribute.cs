using CoursesWebApi.Models.Entity;
using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
using System.Web.Mvc;

using AuthorizeAttribute = Microsoft.AspNetCore.Authorization.AuthorizeAttribute;

namespace CoursesWebApi.Controllers.Attributes
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = true, AllowMultiple = true)]
    public class AuthorizeRoleAttribute : AuthorizeAttribute
    {
        public AuthorizeRoleAttribute(RoleEnum role) : base()
        {
            RoleEnum[] x =  Enum.GetValues<RoleEnum>();
            for (int i = 0; i < x.Length; i++)
            {
                int itterationRoleEnum = Convert.ToInt32(x.GetValue(i));
                int roleEnum = Convert.ToInt32(role);
                if (Convert.ToInt32(x[i]) >= Convert.ToInt32(role))
                {
                    this.Roles += ", " + Enum.GetName(x[i]);
                }
            }
        }
    }
}
