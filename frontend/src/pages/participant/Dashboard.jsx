import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { useParticipantTickets } from '../../hooks/useParticipantTickets';

function formatDate(dateString) {
  if (!dateString) return 'TBD';

  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateString) {
  if (!dateString) return 'TBD';

  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { tickets, isLoading: ticketsLoading } = useParticipantTickets(user?.id, isAuthenticated);

  const { data: approvedEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['approved-events'],
    queryFn: () => eventService.getApprovedEvents(),
    select: (response) => response.data || [],
  });

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const bookedEvents = tickets
    .map((ticket) => {
      const matchingEvent = approvedEvents.find((event) => String(event.id) === String(ticket.eventId));

      return {
        ...ticket,
        event: matchingEvent || null,
        title: matchingEvent?.title || 'Booked event',
        date: matchingEvent?.eventDate || matchingEvent?.date || null,
        venue: matchingEvent?.venue || 'Venue TBD',
        ticketPrice: matchingEvent?.ticketPrice || matchingEvent?.price || 0,
      };
    })
    .sort((left, right) => new Date(right.date || right.bookingDate) - new Date(left.date || left.bookingDate));

  const now = new Date();
  const upcomingBookedEvents = bookedEvents.filter((event) => event.date && new Date(event.date) > now);
  const pastBookedEvents = bookedEvents.filter((event) => !event.date || new Date(event.date) <= now);
  const totalSpent = bookedEvents.reduce((sum, event) => sum + (event.totalPrice || 0), 0);
  const totalTickets = bookedEvents.reduce((sum, event) => sum + (event.quantity || 0), 0);
  const isLoading = ticketsLoading || eventsLoading;

  return (
    <div style={{ backgroundColor: '#f5f3f0', minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontFamily: 'Lobster, cursive', fontSize: '2.5rem', color: '#1a1a2e', marginBottom: '0.5rem' }}>
              My Dashboard
            </h1>
            <p style={{ color: '#666', fontSize: '1rem' }}>Welcome back, {user?.username}!</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <p style={{ color: '#999', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Upcoming Events</p>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#E63946', margin: '0' }}>{upcomingBookedEvents.length}</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <p style={{ color: '#999', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Total Tickets</p>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#E63946', margin: '0' }}>{totalTickets}</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <p style={{ color: '#999', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Total Spent</p>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#E63946', margin: '0' }}>${totalSpent.toFixed(2)}</p>
            </div>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#1a1a2e', marginBottom: '1.5rem', fontWeight: '600', borderBottom: '2px solid #E63946', paddingBottom: '0.5rem' }}>Upcoming Events</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {isLoading ? (
                [1, 2, 3].map((item) => (
                  <div key={item} style={{ height: '240px', borderRadius: '8px', backgroundColor: '#ece4db', animation: 'pulse 1.6s ease-in-out infinite' }} />
                ))
              ) : upcomingBookedEvents.length > 0 ? (
                upcomingBookedEvents.map((event) => (
                  <div key={event.id} style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div style={{ height: '180px', backgroundColor: '#E63946', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '3rem' }}>📋</div>
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a1a2e' }}>{event.title}</h3>
                      <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        <p style={{ margin: '0.25rem 0' }}>📅 {formatDate(event.date)} at {formatTime(event.date)}</p>
                        <p style={{ margin: '0.25rem 0' }}>📍 {event.venue}</p>
                        <p style={{ margin: '0.25rem 0', color: '#E63946', fontWeight: '600' }}>💰 ${Number(event.totalPrice || 0).toFixed(2)}</p>
                      </div>
                      <button onClick={() => navigate(`/events/${event.eventId}`)} style={{ width: '100%', padding: '0.6rem', backgroundColor: '#E63946', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>View Event</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', color: '#666' }}>
                  No upcoming booked events found.
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#1a1a2e', marginBottom: '1.5rem', fontWeight: '600', borderBottom: '2px solid #E63946', paddingBottom: '0.5rem' }}>Recent Bookings</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {isLoading ? (
                [1, 2, 3].map((item) => (
                  <div key={item} style={{ height: '240px', borderRadius: '8px', backgroundColor: '#ece4db', animation: 'pulse 1.6s ease-in-out infinite' }} />
                ))
              ) : pastBookedEvents.length > 0 ? (
                pastBookedEvents.map((event) => (
                  <div key={event.id} style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div style={{ height: '180px', backgroundColor: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '3rem' }}>✓</div>
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a1a2e' }}>{event.title}</h3>
                      <p style={{ color: '#666', fontSize: '0.85rem', margin: '0.5rem 0' }}>📍 {event.venue}</p>
                      <p style={{ color: '#666', fontSize: '0.85rem', margin: '0.5rem 0' }}>📅 {formatDate(event.date || event.bookingDate)}</p>
                      <button onClick={() => navigate(`/events/${event.eventId}`)} style={{ width: '100%', padding: '0.6rem', backgroundColor: 'transparent', color: '#E63946', border: '2px solid #E63946', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>View Event</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', color: '#666' }}>
                  No past bookings yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}