﻿using CoursesWebApi.Models.Entity;

namespace CoursesWebApi.Models.DTO
{
    public class LoginResponseDTO
    {
        public User User { get; set; }
        public string Token {  get; set; }
    }
}
