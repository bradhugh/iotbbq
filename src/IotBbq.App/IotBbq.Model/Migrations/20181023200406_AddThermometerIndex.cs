using Microsoft.EntityFrameworkCore.Migrations;

namespace IotBbq.Model.Migrations
{
    public partial class AddThermometerIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ThermometerIndex",
                table: "Items",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThermometerIndex",
                table: "Items");
        }
    }
}
