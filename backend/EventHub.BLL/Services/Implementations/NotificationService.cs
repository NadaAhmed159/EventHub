using EventHub.BLL.Services.Interfaces;
using EventHub.DAL.Repositories.Interfaces;
using EventHub.Domain.Entities;
using EventHub.Domain.Enums;

namespace EventHub.BLL.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly INotificationRealtimePublisher _notificationPublisher;

        public NotificationService(IUnitOfWork unitOfWork, INotificationRealtimePublisher notificationPublisher)
        {
            _unitOfWork = unitOfWork;
            _notificationPublisher = notificationPublisher;
        }

        private async Task BroadcastNotificationsAsync(IEnumerable<Notification> notifications, CancellationToken cancellationToken = default)
        {
            var notificationList = notifications
                .Where(notification => notification != null)
                .ToList();

            if (notificationList.Count == 0)
                return;

            await _notificationPublisher.PublishCreatedAsync(notificationList, cancellationToken);
        }

        public Task<IEnumerable<Notification>> GetByUserAsync(string userId, CancellationToken cancellationToken = default) =>
            _unitOfWork.Notifications.GetByUserAsync(userId);

        public async Task<Notification> SendAsync(Notification notification, CancellationToken cancellationToken = default)
        {
            await _unitOfWork.Notifications.AddAsync(notification);
            await _unitOfWork.SaveChangesAsync();
            await BroadcastNotificationsAsync(new[] { notification }, cancellationToken);
            return notification;
        }

        public async Task NotifyAdminsOfPendingOrganizerRegistrationAsync(User organizer, CancellationToken cancellationToken = default)
        {
            if (organizer == null)
                return;

            var adminIds = await _unitOfWork.Users.GetApprovedUserIdsByRoleAsync(UserRole.Admin);
            if (adminIds.Count == 0)
                return;

            var fullName = string.Join(" ", new[] { organizer.FirstName, organizer.LastName }
                .Where(part => !string.IsNullOrWhiteSpace(part)));
            var displayName = string.IsNullOrWhiteSpace(fullName) ? organizer.Email : fullName.Trim();

            var notifications = adminIds.Select(adminId => new Notification
            {
                UserId = adminId,
                Title = "New organizer application",
                Message = $"A new organizer application was submitted by {displayName} ({organizer.Email}).",
                IsRead = false
            }).ToList();

            await _unitOfWork.Notifications.AddRangeAsync(notifications);
            await _unitOfWork.SaveChangesAsync();
            await BroadcastNotificationsAsync(notifications, cancellationToken);
        }

        public async Task NotifyAdminsOfPendingEventSubmissionAsync(Event pendingEvent, CancellationToken cancellationToken = default)
        {
            if (pendingEvent == null)
                return;

            var adminIds = await _unitOfWork.Users.GetApprovedUserIdsByRoleAsync(UserRole.Admin);
            if (adminIds.Count == 0)
                return;

            var safeTitle = string.IsNullOrWhiteSpace(pendingEvent.Title) ? "Untitled event" : pendingEvent.Title.Trim();
            var notifications = adminIds.Select(adminId => new Notification
            {
                UserId = adminId,
                Title = "New event submitted",
                Message = $"A new event was submitted and is waiting for approval: {safeTitle}.",
                EventId = pendingEvent.Id,
                IsRead = false
            }).ToList();

            await _unitOfWork.Notifications.AddRangeAsync(notifications);
            await _unitOfWork.SaveChangesAsync();
            await BroadcastNotificationsAsync(notifications, cancellationToken);
        }

        public async Task NotifyOrganizerApprovalDecisionAsync(string organizerUserId, bool approved, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(organizerUserId))
                return;

            var notification = new Notification
            {
                UserId = organizerUserId,
                Title = approved ? "Account approved" : "Account rejected",
                Message = approved
                    ? "Your organizer account has been approved. You can now access organizer features."
                    : "Your organizer account was rejected by an admin.",
                IsRead = false
            };

            await _unitOfWork.Notifications.AddAsync(notification);
            await _unitOfWork.SaveChangesAsync();
            await BroadcastNotificationsAsync(new[] { notification }, cancellationToken);
        }

        public async Task NotifyOrganizerEventDecisionAsync(string organizerUserId, string eventId, string eventTitle, bool approved, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(organizerUserId))
                return;

            var safeTitle = string.IsNullOrWhiteSpace(eventTitle) ? "your event" : eventTitle.Trim();
            var notification = new Notification
            {
                UserId = organizerUserId,
                EventId = eventId,
                Title = approved ? "Event approved" : "Event rejected",
                Message = approved
                    ? $"Your event \"{safeTitle}\" was approved and is now visible on the platform."
                    : $"Your event \"{safeTitle}\" was rejected by an admin.",
                IsRead = false
            };

            await _unitOfWork.Notifications.AddAsync(notification);
            await _unitOfWork.SaveChangesAsync();
            await BroadcastNotificationsAsync(new[] { notification }, cancellationToken);
        }

        public async Task MarkAsReadAsync(string id, string participantUserId, CancellationToken cancellationToken = default)
        {
            var notification = await _unitOfWork.Notifications.GetByIdAsync(id);
            if (notification == null)
                throw new KeyNotFoundException("Notification not found.");

            if (notification.UserId != participantUserId)
                throw new UnauthorizedAccessException("You can only mark your own notifications as read.");

            notification.IsRead = true;
            _unitOfWork.Notifications.Update(notification);
            await _unitOfWork.SaveChangesAsync();

            await _notificationPublisher.PublishReadAsync(participantUserId, notification.Id, cancellationToken);
        }

        public async Task NotifyApprovedParticipantsNewEventCreatedAsync(string eventId, string eventTitle, string organizerName, CancellationToken cancellationToken = default)
        {
            var participantIds = await _unitOfWork.Users.GetApprovedUserIdsByRoleAsync(UserRole.Participant);
            if (participantIds.Count == 0)
                return;

            const string title = "New event available";
            var safeTitle = string.IsNullOrWhiteSpace(eventTitle) ? "Untitled event" : eventTitle.Trim();
            var safeOrganizer = string.IsNullOrWhiteSpace(organizerName) ? "An organizer" : organizerName.Trim();
            var message = $"{safeOrganizer} added a new event: {safeTitle}.";

            var notifications = participantIds.Select(userId => new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                EventId = eventId,
                IsRead = false
            }).ToList();

            await _unitOfWork.Notifications.AddRangeAsync(notifications);
            await _unitOfWork.SaveChangesAsync();
            await BroadcastNotificationsAsync(notifications, cancellationToken);
        }

        public async Task NotifyApprovedParticipantsEventUpdatedAsync(string eventId, string eventTitle, string organizerName, CancellationToken cancellationToken = default)
        {
            var participantIds = await _unitOfWork.Users.GetApprovedUserIdsByRoleAsync(UserRole.Participant);
            if (participantIds.Count == 0)
                return;

            const string title = "Event updated";
            var safeTitle = string.IsNullOrWhiteSpace(eventTitle) ? "Untitled event" : eventTitle.Trim();
            var safeOrganizer = string.IsNullOrWhiteSpace(organizerName) ? "An organizer" : organizerName.Trim();
            var message = $"{safeOrganizer} updated the event: {safeTitle}.";

            var notifications = participantIds.Select(userId => new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                EventId = eventId,
                IsRead = false
            }).ToList();

            await _unitOfWork.Notifications.AddRangeAsync(notifications);
            await _unitOfWork.SaveChangesAsync();
            await BroadcastNotificationsAsync(notifications, cancellationToken);
        }

        public async Task NotifyTicketHoldersOfNewEventAttachmentAsync(string eventId, string uploadedFileDisplayName, CancellationToken cancellationToken = default)
        {
            var eventEntity = await _unitOfWork.Events.GetByIdAsync(eventId);
            if (eventEntity == null)
                return;

            if (eventEntity.Status != EventStatus.Approved || eventEntity.EventDate <= DateTime.UtcNow)
                return;

            var participantIds = await _unitOfWork.Tickets.GetDistinctParticipantIdsForEventAsync(eventId, cancellationToken);
            if (participantIds.Count == 0)
                return;

            const string title = "New attachment for your event";
            var safeEventTitle = string.IsNullOrWhiteSpace(eventEntity.Title) ? "your event" : eventEntity.Title.Trim();
            var safeFile = string.IsNullOrWhiteSpace(uploadedFileDisplayName) ? "a new file" : uploadedFileDisplayName.Trim();
            var message = $"A new file was added to \"{safeEventTitle}\": {safeFile}.";

            var notifications = participantIds.Select(userId => new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                EventId = eventId,
                IsRead = false
            }).ToList();

            await _unitOfWork.Notifications.AddRangeAsync(notifications);
            await _unitOfWork.SaveChangesAsync();
            await BroadcastNotificationsAsync(notifications, cancellationToken);
        }
    }
}
