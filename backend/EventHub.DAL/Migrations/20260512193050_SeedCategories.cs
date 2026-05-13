using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EventHub.DAL.Migrations
{
    /// <inheritdoc />
    public partial class SeedCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "Description", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { "cat-art", new DateTime(2026, 5, 12, 19, 30, 42, 953, DateTimeKind.Utc).AddTicks(7293), null, "Art", null },
                    { "cat-music", new DateTime(2026, 5, 12, 19, 30, 42, 953, DateTimeKind.Utc).AddTicks(7260), null, "Music", null },
                    { "cat-sport", new DateTime(2026, 5, 12, 19, 30, 42, 953, DateTimeKind.Utc).AddTicks(7304), null, "Sport", null },
                    { "cat-tech", new DateTime(2026, 5, 12, 19, 30, 42, 953, DateTimeKind.Utc).AddTicks(7282), null, "Technology", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-art");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-music");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-sport");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-tech");
        }
    }
}
