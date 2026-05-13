import EventCard from './EventCard';

export default function EventGrid({ events, isLoading, isEmpty, bookedEventIds = new Set() }) {
  if (isLoading) {
    return (
      <div className="container">
        <div className="events-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#e0d5c7',
                borderRadius: '12px',
                height: '400px',
                animation: 'pulse 2s infinite'
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>No events found</h3>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="container">
      <p style={{ marginBottom: '1rem', color: '#666' }}>
        Showing <strong>{events.length}</strong> events
      </p>
      <div className="events-grid">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isSoldOut={event.availableTickets === 0}
            isBooked={bookedEventIds.has(String(event.id))}
          />
        ))}
      </div>
    </div>
  );
}

