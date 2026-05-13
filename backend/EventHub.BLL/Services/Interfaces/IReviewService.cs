using EventHub.Domain.Entities;

namespace EventHub.BLL.Services.Interfaces
{
    public interface IReviewService
    {
        Task<Review> CreateAsync(Review review, CancellationToken cancellationToken = default);
        Task<IEnumerable<Review>> GetByEventAsync(string eventId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Review>> GetByUserAsync(string userId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Review>> GetByOrganizerAsync(string organizerId, CancellationToken cancellationToken = default);
        Task<IEnumerable<Review>> GetAllWithDetailsAsync(CancellationToken cancellationToken = default);
        Task DeleteAsync(string id, string userId, CancellationToken cancellationToken = default);
    }
}
