using Microsoft.EntityFrameworkCore.Migrations;

namespace IotBbq.Web.Model.Migrations
{
    public partial class RenameProbeNumber : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ThermometerIndex",
                table: "Items",
                newName: "ProbeNumber");

            migrationBuilder.RenameColumn(
                name: "Thermometer",
                table: "ItemLogs",
                newName: "ProbeNumber");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProbeNumber",
                table: "Items",
                newName: "ThermometerIndex");

            migrationBuilder.RenameColumn(
                name: "ProbeNumber",
                table: "ItemLogs",
                newName: "Thermometer");
        }
    }
}
