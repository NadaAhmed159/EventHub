namespace EventHub.BLL.Models
{
    public sealed class TicketPurchaseResult
    {
        public string OrderId { get; set; } = string.Empty;
        public string EventId { get; set; } = string.Empty;
        public string ParticipantId { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public int RemainingAvailableTickets { get; set; }
        public string TicketId { get; set; } = string.Empty;
        public string TicketQrCode { get; set; } = string.Empty;
        public string TicketQrCodeImagePath { get; set; } = string.Empty;
    }

    public class BookedTicketDto
    {
        public string Id { get; set; } = string.Empty;
        public string EventId { get; set; } = string.Empty;
        public string ParticipantId { get; set; } = string.Empty;
        public string OrderId { get; set; } = string.Empty;
        public string QrCode { get; set; } = string.Empty;
        public DateTime PurchasedAt { get; set; }
        public DateTime? UsedAtUtc { get; set; }

        // Event Details
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime EventDate { get; set; }
        public string Venue { get; set; } = string.Empty;
        public string? Image { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        // Organizer Details
        public string OrganizerName { get; set; } = string.Empty;

        // Order Details
        public decimal TotalPrice { get; set; }
        public int Quantity { get; set; }

        // Computed
        public string Status { get; set; } = "Confirmed";
        public string BookingDate => PurchasedAt.ToString("yyyy-MM-dd");
    }
}
