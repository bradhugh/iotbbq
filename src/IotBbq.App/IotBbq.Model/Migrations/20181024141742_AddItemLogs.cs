using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IotBbq.Model.Migrations
{
    public partial class AddItemLogs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ItemLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Timestamp = table.Column<DateTime>(nullable: false),
                    BbqItemId = table.Column<Guid>(nullable: false),
                    ItemName = table.Column<string>(nullable: true),
                    Temperature = table.Column<double>(nullable: false),
                    Thermometer = table.Column<int>(nullable: false),
                    CurrentPhase = table.Column<string>(nullable: true)
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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemLogs");
        }
    }
}
