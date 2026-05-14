using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace EventHub.API.Hubs
{
    [Authorize]
    public sealed class NotificationHub : Hub
    {
        public static string GroupName(string userId) => $"notifications-{userId}";

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? Context.User?.FindFirstValue("sub");

            if (!string.IsNullOrWhiteSpace(userId))
                await Groups.AddToGroupAsync(Context.ConnectionId, GroupName(userId));

            await base.OnConnectedAsync();
        }
    }
}