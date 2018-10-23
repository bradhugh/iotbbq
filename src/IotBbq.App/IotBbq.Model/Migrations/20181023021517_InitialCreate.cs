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
                    BbqEventId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EventDate = table.Column<DateTime>(nullable: false),
                    EventName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.BbqEventId);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    BbqModelItemId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BbqEventId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.BbqModelItemId);
                    table.ForeignKey(
                        name: "FK_Items_Events_BbqEventId",
                        column: x => x.BbqEventId,
                        principalTable: "Events",
                        principalColumn: "BbqEventId",
                        onDelete: ReferentialAction.Restrict);
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
