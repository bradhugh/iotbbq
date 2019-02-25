using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IotBbq.Web.Model.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    EventDate = table.Column<DateTime>(nullable: false),
                    TurnInTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    EventId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    ItemType = table.Column<string>(nullable: true),
                    CurrentPhase = table.Column<string>(nullable: true),
                    Weight = table.Column<float>(nullable: false),
                    TargetTemperature = table.Column<float>(nullable: false),
                    Temperature = table.Column<float>(nullable: false),
                    CookStartTime = table.Column<DateTime>(nullable: true),
                    ThermometerIndex = table.Column<int>(nullable: false),
                    BbqEventId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Items_Events_BbqEventId",
                        column: x => x.BbqEventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SmokerLog",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Timestamp = table.Column<DateTime>(nullable: false),
                    EventId = table.Column<Guid>(nullable: false),
                    SetTo = table.Column<float>(nullable: false),
                    Temperature = table.Column<float>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SmokerLog", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SmokerLog_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItemLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    EventId = table.Column<Guid>(nullable: false),
                    BbqItemId = table.Column<Guid>(nullable: false),
                    Timestamp = table.Column<DateTime>(nullable: false),
                    CurrentPhase = table.Column<string>(nullable: true),
                    ItemName = table.Column<string>(nullable: true),
                    Thermometer = table.Column<int>(nullable: false),
                    Temperature = table.Column<float>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemLogs_Items_BbqItemId",
                        column: x => x.BbqItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItemLogs_BbqItemId",
                table: "ItemLogs",
                column: "BbqItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_BbqEventId",
                table: "Items",
                column: "BbqEventId");

            migrationBuilder.CreateIndex(
                name: "IX_SmokerLog_EventId",
                table: "SmokerLog",
                column: "EventId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemLogs");

            migrationBuilder.DropTable(
                name: "SmokerLog");

            migrationBuilder.DropTable(
                name: "Items");

            migrationBuilder.DropTable(
                name: "Events");
        }
    }
}
