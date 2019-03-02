using Microsoft.EntityFrameworkCore.Migrations;

namespace IotBbq.Web.Model.Migrations
{
    public partial class AddElapsedCookTime : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "ElapsedCookTime",
                table: "ItemLogs",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ElapsedCookTime",
                table: "ItemLogs");
        }
    }
}
