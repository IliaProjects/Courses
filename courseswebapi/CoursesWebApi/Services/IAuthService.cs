using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.DTO;

namespace CoursesWebApi.Services
{
    public interface IAuthService
    {
        bool IsUniqueUser(string username);
        Task<LoginResponseDTO> Login(LoginRequestDTO loginRequestDTO);
        Task<User> Register(RegistrationRequestDTO registrationRequestDTO);
    }
}
