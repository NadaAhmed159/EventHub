import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { getEventDate, getEventPrice, getEventTotalTickets } from '../../utils/eventUtils';

function formatDate(dateString) {
	if (!dateString) return 'TBD';

	return new Date(dateString).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

export default function OrganizerDashboard() {
	const navigate = useNavigate();
	const { isAuthenticated, user } = useContext(AuthContext);

	const { data: organizerEvents = [], isLoading } = useQuery({
		queryKey: ['organizer-events', user?.id],
		queryFn: () => eventService.getEventsByOrganizer(user.id),
		select: (response) => response.data || [],
		enabled: isAuthenticated && user?.applyAs === 'EventOrganizer' && !!user?.id,
	});

	if (!isAuthenticated || user?.applyAs !== 'EventOrganizer') {
		navigate('/');
		return null;
	}

	const stats = useMemo(() => {
		let approved = 0;
		let pending = 0;
		let rejected = 0;
		let totalTicketsSold = 0;
		let grossRevenue = 0;

		organizerEvents.forEach((event) => {
			const status = (event.status || '').toLowerCase();
			if (status === 'approved') approved += 1;
			else if (status === 'pending') pending += 1;
			else if (status === 'rejected') rejected += 1;

			const totalTickets = getEventTotalTickets(event);
			const availableTickets = Number(event.availableTickets ?? totalTickets);
			const sold = Math.max(totalTickets - availableTickets, 0);
			totalTicketsSold += sold;
			grossRevenue += sold * getEventPrice(event);
		});

		return {
			total: organizerEvents.length,
			approved,
			pending,
			rejected,
			totalTicketsSold,
			grossRevenue,
		};
	}, [organizerEvents]);

	const upcomingEvents = useMemo(() => {
		const now = new Date();
		return organizerEvents
			.filter((event) => {
				const value = getEventDate(event);
				return value && new Date(value) > now;
			})
			.sort((left, right) => new Date(getEventDate(left)) - new Date(getEventDate(right)))
			.slice(0, 5);
	}, [organizerEvents]);

	return (
		<div style={{ minHeight: '100vh', backgroundColor: '#f5f3f0' }}>
			<Header />
			<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
				<div style={{ marginBottom: '1.5rem' }}>
					<h1 style={{ margin: 0, fontFamily: "'Lobster Two', cursive", fontSize: '2.6rem', color: '#1a1a2e' }}>Organizer Dashboard</h1>
					<p style={{ marginTop: '0.5rem', color: '#666' }}>
						Welcome back, {user?.username || 'Organizer'}.
					</p>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
					<div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
						<div style={{ color: '#7a7a7a', fontSize: '0.85rem' }}>Total events</div>
						<div style={{ color: '#1a1a2e', fontWeight: '800', fontSize: '1.8rem' }}>{stats.total}</div>
					</div>
					<div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
						<div style={{ color: '#7a7a7a', fontSize: '0.85rem' }}>Approved</div>
						<div style={{ color: '#15803d', fontWeight: '800', fontSize: '1.8rem' }}>{stats.approved}</div>
					</div>
					<div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
						<div style={{ color: '#7a7a7a', fontSize: '0.85rem' }}>Pending review</div>
						<div style={{ color: '#b54708', fontWeight: '800', fontSize: '1.8rem' }}>{stats.pending}</div>
					</div>
					<div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
						<div style={{ color: '#7a7a7a', fontSize: '0.85rem' }}>Rejected</div>
						<div style={{ color: '#b42318', fontWeight: '800', fontSize: '1.8rem' }}>{stats.rejected}</div>
					</div>
					<div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
						<div style={{ color: '#7a7a7a', fontSize: '0.85rem' }}>Tickets sold</div>
						<div style={{ color: '#1a1a2e', fontWeight: '800', fontSize: '1.8rem' }}>{stats.totalTicketsSold}</div>
					</div>
					<div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
						<div style={{ color: '#7a7a7a', fontSize: '0.85rem' }}>Estimated revenue</div>
						<div style={{ color: '#E63946', fontWeight: '800', fontSize: '1.8rem' }}>${stats.grossRevenue.toFixed(2)}</div>
					</div>
				</div>

				<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
					<button type="button" onClick={() => navigate('/create-event')} style={{ padding: '0.7rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: '#E63946', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
						Create Event
					</button>
					<button type="button" onClick={() => navigate('/my-events')} style={{ padding: '0.7rem 1rem', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#1a1a2e', fontWeight: '700', cursor: 'pointer' }}>
						Manage Events
					</button>
					<button type="button" onClick={() => navigate('/organizer-analytics')} style={{ padding: '0.7rem 1rem', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#1a1a2e', fontWeight: '700', cursor: 'pointer' }}>
						View Analytics
					</button>
				</div>

				<div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
					<h2 style={{ margin: '0 0 0.8rem 0', color: '#1a1a2e', fontSize: '1.2rem' }}>Upcoming events</h2>
					{isLoading ? (
						<p style={{ margin: 0, color: '#666' }}>Loading dashboard...</p>
					) : upcomingEvents.length === 0 ? (
						<p style={{ margin: 0, color: '#666' }}>No upcoming events yet.</p>
					) : (
						<div style={{ display: 'grid', gap: '0.7rem' }}>
							{upcomingEvents.map((event) => (
								<div key={event.id} style={{ border: '1px solid #f0f0f0', borderRadius: '10px', padding: '0.8rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
									<div>
										<div style={{ fontWeight: '700', color: '#1a1a2e' }}>{event.title}</div>
										<div style={{ color: '#666', fontSize: '0.9rem' }}>{formatDate(getEventDate(event))} • {event.venue || 'Venue TBD'}</div>
									</div>
									<button type="button" onClick={() => navigate(`/edit-event/${event.id}`)} style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', fontWeight: '700', cursor: 'pointer' }}>
										Edit
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
