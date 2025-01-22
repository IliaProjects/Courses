using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoursesWebApi.Migrations
{
    /// <inheritdoc />
    public partial class PublishedOnMainAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "PublishOnMain",
                table: "Courses",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PublishOnMain",
                table: "Courses");
        }
    }
}
