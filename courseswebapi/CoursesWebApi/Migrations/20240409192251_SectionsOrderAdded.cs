using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoursesWebApi.Migrations
{
    /// <inheritdoc />
    public partial class SectionsOrderAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "CourseSections",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "CourseSections");
        }
    }
}
