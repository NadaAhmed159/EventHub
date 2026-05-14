using EventHub.BLL.Services.Interfaces;
using EventHub.Domain.Entities;
using EventHub.Domain.Enums;

namespace EventHub.BLL.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly IUserService _userService;
        private readonly IEventService _eventService;
        private readonly INotificationService _notificationService;

        public AdminService(IUserService userService, IEventService eventService, INotificationService notificationService)
        {
            _userService = userService;
            _eventService = eventService;
            _notificationService = notificationService;
        }

        public async Task<IEnumerable<User>> GetPendingAccountsAsync(CancellationToken cancellationToken = default)
        {
            return await _userService.GetPendingOrganizersAsync();
        }

        public async Task<IEnumerable<Event>> GetPendingEventsAsync(CancellationToken cancellationToken = default)
        {
            return await _eventService.GetPendingEventsAsync();
        }

        public async Task ApproveOrganizerAsync(string userId, CancellationToken cancellationToken = default)
        {
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found.");
            if (user.Status != AccountStatus.Pending)
                throw new InvalidOperationException("Only pending organizers can be accepted.");

            await _userService.ApproveOrganizerAsync(userId);
            await _notificationService.NotifyOrganizerApprovalDecisionAsync(userId, approved: true, cancellationToken);
        }

        public async Task RejectOrganizerAsync(string userId, CancellationToken cancellationToken = default)
        {
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
                throw new KeyNotFoundException("User not found.");

            if (user.Status != AccountStatus.Pending)
                throw new InvalidOperationException("Only pending organizers can be rejected.");

            await _userService.RejectOrganizerAsync(userId);
            await _notificationService.NotifyOrganizerApprovalDecisionAsync(userId, approved: false, cancellationToken);
        }

        public async Task ApproveEventAsync(string eventId, CancellationToken cancellationToken = default)
        {
            var @event = await _eventService.GetEventByIdAsync(eventId);
            if (@event == null)
                throw new KeyNotFoundException("Event not found.");

            if (@event.Status != EventStatus.Pending)
                throw new InvalidOperationException("Only pending events can be approved.");

            await _eventService.ApproveEventAsync(eventId);
            await _notificationService.NotifyOrganizerEventDecisionAsync(@event.OrganizerId, @event.Id, @event.Title, approved: true, cancellationToken);
            var organizerName = string.Join(" ", new[] { @event.Organizer?.FirstName, @event.Organizer?.LastName }
                .Where(part => !string.IsNullOrWhiteSpace(part)));
            await _notificationService.NotifyApprovedParticipantsNewEventCreatedAsync(@event.Id, @event.Title, organizerName, cancellationToken);
        }

        public async Task RejectEventAsync(string eventId, CancellationToken cancellationToken = default)
        {
            var @event = await _eventService.GetEventByIdAsync(eventId);
            if (@event == null)
                throw new KeyNotFoundException("Event not found.");

            if (@event.Status != EventStatus.Pending)
                throw new InvalidOperationException("Only pending events can be rejected.");
            await _eventService.RejectEventAsync(eventId);
            await _notificationService.NotifyOrganizerEventDecisionAsync(@event.OrganizerId, @event.Id, @event.Title, approved: false, cancellationToken);
        }
    }
}
