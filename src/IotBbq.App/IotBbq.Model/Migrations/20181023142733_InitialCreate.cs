using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IotBbq.Model.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EventDate = table.Column<DateTime>(nullable: false),
                    EventName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BbqEventId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    ItemType = table.Column<string>(nullable: true),
                    CurrentPhase = table.Column<string>(nullable: true),
                    Weight = table.Column<double>(nullable: false),
                    TargetTemperature = table.Column<double>(nullable: false),
                    CookStartTime = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Items_Events_BbqEventId",
                        column: x => x.BbqEventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Items_BbqEventId",
                table: "Items",
                column: "BbqEventId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Items");

            migrationBuilder.DropTable(
                name: "Events");
        }
    }
}
