using EventHub.BLL.Services.Interfaces;
using EventHub.Domain.Entities;
using Microsoft.AspNetCore.SignalR;

namespace EventHub.API.Hubs
{
    public sealed class SignalRNotificationPublisher : INotificationRealtimePublisher
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public SignalRNotificationPublisher(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task PublishCreatedAsync(IEnumerable<Notification> notifications, CancellationToken cancellationToken = default)
        {
            var list = notifications?.Where(notification => notification != null).ToList() ?? new List<Notification>();
            if (list.Count == 0)
                return;

            var tasks = list.Select(notification =>
                _hubContext.Clients.Group(NotificationHub.GroupName(notification.UserId))
                    .SendAsync("notification:new", notification, cancellationToken));

            await Task.WhenAll(tasks);
        }

        public async Task PublishReadAsync(string userId, string notificationId, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(notificationId))
                return;

            await _hubContext.Clients.Group(NotificationHub.GroupName(userId))
                .SendAsync("notification:read", new { notificationId }, cancellationToken);
        }
    }
}
