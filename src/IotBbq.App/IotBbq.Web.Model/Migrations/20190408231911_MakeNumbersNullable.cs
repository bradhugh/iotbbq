using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IotBbq.Web.Model.Migrations
{
    public partial class MakeNumbersNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_Events_BbqEventId",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Items_BbqEventId",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "BbqEventId",
                table: "Items");

            migrationBuilder.AlterColumn<float>(
                name: "Temperature",
                table: "SmokerLog",
                nullable: true,
                oldClrType: typeof(float));

            migrationBuilder.AlterColumn<float>(
                name: "SetTo",
                table: "SmokerLog",
                nullable: true,
                oldClrType: typeof(float));

            migrationBuilder.AlterColumn<float>(
                name: "Weight",
                table: "Items",
                nullable: true,
                oldClrType: typeof(float));

            migrationBuilder.AlterColumn<float>(
                name: "Temperature",
                table: "Items",
                nullable: true,
                oldClrType: typeof(float));

            migrationBuilder.AlterColumn<float>(
                name: "TargetTemperature",
                table: "Items",
                nullable: true,
                oldClrType: typeof(float));

            migrationBuilder.AlterColumn<int>(
                name: "ProbeNumber",
                table: "Items",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<float>(
                name: "Temperature",
                table: "ItemLogs",
                nullable: true,
                oldClrType: typeof(float));

            migrationBuilder.AlterColumn<int>(
                name: "ProbeNumber",
                table: "ItemLogs",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<float>(
                name: "ElapsedCookTime",
                table: "ItemLogs",
                nullable: true,
                oldClrType: typeof(float));

            migrationBuilder.AlterColumn<DateTime>(
                name: "TurnInTime",
                table: "Events",
                nullable: true,
                oldClrType: typeof(DateTime));

            migrationBuilder.AlterColumn<DateTime>(
                name: "EventDate",
                table: "Events",
                nullable: true,
                oldClrType: typeof(DateTime));

            migrationBuilder.CreateIndex(
                name: "IX_Items_EventId",
                table: "Items",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_Events_EventId",
                table: "Items",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_Events_EventId",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Items_EventId",
                table: "Items");

            migrationBuilder.AlterColumn<float>(
                name: "Temperature",
                table: "SmokerLog",
                nullable: false,
                oldClrType: typeof(float),
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "SetTo",
                table: "SmokerLog",
                nullable: false,
                oldClrType: typeof(float),
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "Weight",
                table: "Items",
                nullable: false,
                oldClrType: typeof(float),
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "Temperature",
                table: "Items",
                nullable: false,
                oldClrType: typeof(float),
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "TargetTemperature",
                table: "Items",
                nullable: false,
                oldClrType: typeof(float),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ProbeNumber",
                table: "Items",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "BbqEventId",
                table: "Items",
                nullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "Temperature",
                table: "ItemLogs",
                nullable: false,
                oldClrType: typeof(float),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ProbeNumber",
                table: "ItemLogs",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "ElapsedCookTime",
                table: "ItemLogs",
                nullable: false,
                oldClrType: typeof(float),
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "TurnInTime",
                table: "Events",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "EventDate",
                table: "Events",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Items_BbqEventId",
                table: "Items",
                column: "BbqEventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_Events_BbqEventId",
                table: "Items",
                column: "BbqEventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
