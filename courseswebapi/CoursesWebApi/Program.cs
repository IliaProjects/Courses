using CoursesWebApi.DataGateway;
using CoursesWebApi.Models;
using CoursesWebApi.Models.Entity;
using CoursesWebApi.Services;
using CoursesWebApi.Services.DomainServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var key = builder.Configuration.GetValue<string>("ApiSettings:Secret");
// Add services to the container.
builder.Services.AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(x => { 
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
            RequireExpirationTime = true,
            ClockSkew = TimeSpan.Zero,
        };

    }
);
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
                      policy =>
                          policy.SetIsOriginAllowed(origin => true) // allow any origin
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials());
});
builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);
builder.Services.AddDbContext<AppDbContext>(/*o => o.UseLazyLoadingProxies(), */ServiceLifetime.Scoped);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

builder.Services.AddScoped<IDataMapper<Lesson>, LessonMapper>();
builder.Services.AddScoped<IDataMapper<Role>, RoleMapper>();
builder.Services.AddScoped<IDataMapper<Course>, CourseMapper>();
builder.Services.AddScoped<IDataMapper<CourseSection>, CourseSectionMapper>();
builder.Services.AddScoped<IDataMapper<User>, UserMapper>();
builder.Services.AddScoped<IDataMapper<LessonVideo>, VideoMapper>();
builder.Services.AddScoped<IDataMapper<CourseRequest>, CourseRequestMapper>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<RoleService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<CourseService>();
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.Use(async (context, next) =>
{
    Thread.CurrentPrincipal = context.User;
    await next(context);
});

app.UseCors();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Автоматическая миграция
try
{
    ServiceProvider prov = builder.Services.BuildServiceProvider();
    using (var scope = prov.GetService<IServiceScopeFactory>().CreateScope())
    {
        // основной контекст данных
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // context.EnsureDeleted(); //Сброс базы данных при необходимости
        if (!context.AllMigrationsApplied())
        {
            /*context.EnsureDeleted();*/
            context.Database.Migrate();
            context.EnsureSeedData(scope.ServiceProvider.GetService<RoleService>(),
                scope.ServiceProvider.GetService<UserService>()).Wait();
        }
    }
}

catch (Exception ex)
{
    Console.WriteLine(ex.Message + ex.StackTrace);
}




ServiceProvider provider = builder.Services.BuildServiceProvider();
UserService userService = provider.GetService<UserService>();
RoleService roleService = provider.GetService<RoleService>();

//CourseService courseService = provider.GetService<CourseService>();

AppDbContext dbContext = builder.Services.BuildServiceProvider().GetService<AppDbContext>();
/*dbContext.EnsureDeleted();*/
/*dbContext.EnsureCreated();*/
/*dbContext.EnsureSeedData(roleService, userService);*/
//await roleService.SeedRoles();
//await userService.SeedUsersTest();
/*await userService.SeedUsersTest2();*/

//await courseService.SeedCourses();

app.Run();