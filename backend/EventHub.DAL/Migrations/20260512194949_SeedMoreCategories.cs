using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EventHub.DAL.Migrations
{
    /// <inheritdoc />
    public partial class SeedMoreCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-art",
                column: "CreatedAt",
                value: new DateTime(2026, 5, 12, 19, 49, 48, 878, DateTimeKind.Utc).AddTicks(9421));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-music",
                column: "CreatedAt",
                value: new DateTime(2026, 5, 12, 19, 49, 48, 878, DateTimeKind.Utc).AddTicks(9413));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-sport",
                column: "CreatedAt",
                value: new DateTime(2026, 5, 12, 19, 49, 48, 878, DateTimeKind.Utc).AddTicks(9424));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-tech",
                column: "CreatedAt",
                value: new DateTime(2026, 5, 12, 19, 49, 48, 878, DateTimeKind.Utc).AddTicks(9419));

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "Description", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { "cat-business", new DateTime(2026, 5, 12, 19, 49, 48, 878, DateTimeKind.Utc).AddTicks(9431), null, "Business", null },
                    { "cat-education", new DateTime(2026, 5, 12, 19, 49, 48, 878, DateTimeKind.Utc).AddTicks(9442), null, "Education", null },
                    { "cat-entertainment", new DateTime(2026, 5, 12, 19, 49, 48, 878, DateTimeKind.Utc).AddTicks(9428), null, "Entertainment", null },
                    { "cat-health", new DateTime(2026, 5, 12, 19, 49, 48, 878, DateTimeKind.Utc).AddTicks(9426), null, "Health", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-business");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-education");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-entertainment");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-health");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-art",
                column: "CreatedAt",
                value: new DateTime(2026, 5, 12, 19, 30, 42, 953, DateTimeKind.Utc).AddTicks(7293));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-music",
                column: "CreatedAt",
                value: new DateTime(2026, 5, 12, 19, 30, 42, 953, DateTimeKind.Utc).AddTicks(7260));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-sport",
                column: "CreatedAt",
                value: new DateTime(2026, 5, 12, 19, 30, 42, 953, DateTimeKind.Utc).AddTicks(7304));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: "cat-tech",
                column: "CreatedAt",
                value: new DateTime(2026, 5, 12, 19, 30, 42, 953, DateTimeKind.Utc).AddTicks(7282));
        }
    }
}
