using EventHub.Domain.Entities;

namespace EventHub.BLL.Services.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<Notification>> GetByUserAsync(string userId, CancellationToken cancellationToken = default);
        Task<Notification> SendAsync(Notification notification, CancellationToken cancellationToken = default);
        Task NotifyAdminsOfPendingOrganizerRegistrationAsync(User organizer, CancellationToken cancellationToken = default);
        Task NotifyAdminsOfPendingEventSubmissionAsync(Event pendingEvent, CancellationToken cancellationToken = default);
        Task NotifyOrganizerApprovalDecisionAsync(string organizerUserId, bool approved, CancellationToken cancellationToken = default);
        Task NotifyOrganizerEventDecisionAsync(string organizerUserId, string eventId, string eventTitle, bool approved, CancellationToken cancellationToken = default);
        /// <summary>Marks a notification read only if it belongs to <paramref name="participantUserId"/>.</summary>
        Task MarkAsReadAsync(string id, string participantUserId, CancellationToken cancellationToken = default);
        Task NotifyApprovedParticipantsNewEventCreatedAsync(string eventId, string eventTitle, CancellationToken cancellationToken = default);
        /// <summary>Notifies users who bought a ticket for this event when an attachment is added (approved, upcoming events only).</summary>
        Task NotifyTicketHoldersOfNewEventAttachmentAsync(string eventId, string uploadedFileDisplayName, CancellationToken cancellationToken = default);
    }
}
