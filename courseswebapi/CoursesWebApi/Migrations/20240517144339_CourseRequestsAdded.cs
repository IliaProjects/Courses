using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CoursesWebApi.Migrations
{
    /// <inheritdoc />
    public partial class CourseRequestsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CourseRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Authorized = table.Column<bool>(type: "boolean", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PhoneNr = table.Column<string>(type: "text", nullable: true),
                    Message = table.Column<string>(type: "text", nullable: false),
                    Completed = table.Column<bool>(type: "boolean", nullable: false),
                    CourseId = table.Column<int>(type: "integer", nullable: true),
                    SectionId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseRequests_CourseSections_SectionId",
                        column: x => x.SectionId,
                        principalTable: "CourseSections",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CourseRequests_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseRequests_CourseId",
                table: "CourseRequests",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseRequests_SectionId",
                table: "CourseRequests",
                column: "SectionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseRequests");
        }
    }
}
