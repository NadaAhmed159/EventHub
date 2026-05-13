namespace EventHub.BLL.Services.Interfaces
{
    public interface IAdminService
    {
        Task<IEnumerable<EventHub.Domain.Entities.User>> GetPendingAccountsAsync(CancellationToken cancellationToken = default);
        Task<IEnumerable<EventHub.Domain.Entities.Event>> GetPendingEventsAsync(CancellationToken cancellationToken = default);
        Task ApproveOrganizerAsync(string userId, CancellationToken cancellationToken = default);
        Task RejectOrganizerAsync(string userId, CancellationToken cancellationToken = default);
        Task ApproveEventAsync(string eventId, CancellationToken cancellationToken = default);
        Task RejectEventAsync(string eventId, CancellationToken cancellationToken = default);
    }
}
