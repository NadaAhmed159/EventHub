import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { getEventDate, getEventPrice, getEventTotalTickets } from '../../utils/eventUtils';

function formatDate(value) {
	if (!value) return 'TBD';
	return new Date(value).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

export default function OrganizerAnalytics() {
	const navigate = useNavigate();
	const { user, isAuthenticated } = useContext(AuthContext);

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

	const summary = useMemo(() => {
		const initial = {
			approved: 0,
			pending: 0,
			rejected: 0,
			totalSold: 0,
			revenue: 0,
		};

		organizerEvents.forEach((event) => {
			const status = (event.status || '').toLowerCase();
			if (status === 'approved') initial.approved += 1;
			else if (status === 'pending') initial.pending += 1;
			else if (status === 'rejected') initial.rejected += 1;

			const total = getEventTotalTickets(event);
			const available = Number(event.availableTickets ?? total);
			const sold = Math.max(total - available, 0);
			initial.totalSold += sold;
			initial.revenue += sold * getEventPrice(event);
		});

		return initial;
	}, [organizerEvents]);

	const topEvents = useMemo(() => {
		return organizerEvents
			.map((event) => {
				const total = getEventTotalTickets(event);
				const available = Number(event.availableTickets ?? total);
				const sold = Math.max(total - available, 0);
				const revenue = sold * getEventPrice(event);
				const sellThrough = total > 0 ? Math.round((sold / total) * 100) : 0;
				return {
					...event,
					sold,
					revenue,
					sellThrough,
				};
			})
			.sort((left, right) => right.revenue - left.revenue)
			.slice(0, 8);
	}, [organizerEvents]);

	return (
		<div style={{ minHeight: '100vh', backgroundColor: '#f5f3f0' }}>
			<Header />
			<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
				<div style={{ marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
					<div>
						<h1 style={{ margin: 0, fontFamily: "'Lobster Two', cursive", fontSize: '2.6rem', color: '#1a1a2e' }}>Analytics</h1>
						<p style={{ marginTop: '0.45rem', color: '#666' }}>Sales and performance snapshots for your events.</p>
					</div>
					<button type="button" onClick={() => navigate('/organizer-dashboard')} style={{ padding: '0.7rem 1rem', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#1a1a2e', fontWeight: '700', cursor: 'pointer' }}>
						Back to Dashboard
					</button>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
					<div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
						<div style={{ color: '#7a7a7a', fontSize: '0.85rem' }}>Approved events</div>
						<div style={{ color: '#15803d', fontWeight: '800', fontSize: '2rem' }}>{summary.approved}</div>
					</div>
					<div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
						<div style={{ color: '#7a7a7a', fontSize: '0.85rem' }}>Pending events</div>
						<div style={{ color: '#b54708', fontWeight: '800', fontSize: '2rem' }}>{summary.pending}</div>
					</div>
					<div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
						<div style={{ color: '#7a7a7a', fontSize: '0.85rem' }}>Tickets sold</div>
						<div style={{ color: '#1a1a2e', fontWeight: '800', fontSize: '2rem' }}>{summary.totalSold}</div>
					</div>
					<div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
						<div style={{ color: '#7a7a7a', fontSize: '0.85rem' }}>Estimated revenue</div>
						<div style={{ color: '#E63946', fontWeight: '800', fontSize: '2rem' }}>${summary.revenue.toFixed(2)}</div>
					</div>
				</div>

				<div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
					<div style={{ padding: '1rem', borderBottom: '1px solid #f0f0f0' }}>
						<h2 style={{ margin: 0, color: '#1a1a2e', fontSize: '1.1rem' }}>Top events by revenue</h2>
					</div>

					{isLoading ? (
						<p style={{ margin: 0, padding: '1rem', color: '#666' }}>Loading analytics...</p>
					) : topEvents.length === 0 ? (
						<p style={{ margin: 0, padding: '1rem', color: '#666' }}>No event performance data yet.</p>
					) : (
						<div style={{ overflowX: 'auto' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
								<thead>
									<tr style={{ backgroundColor: '#fafafa' }}>
										<th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#666', fontSize: '0.82rem', textTransform: 'uppercase' }}>Event</th>
										<th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: '#666', fontSize: '0.82rem', textTransform: 'uppercase' }}>Date</th>
										<th style={{ textAlign: 'right', padding: '0.75rem 1rem', color: '#666', fontSize: '0.82rem', textTransform: 'uppercase' }}>Sold</th>
										<th style={{ textAlign: 'right', padding: '0.75rem 1rem', color: '#666', fontSize: '0.82rem', textTransform: 'uppercase' }}>Sell-through</th>
										<th style={{ textAlign: 'right', padding: '0.75rem 1rem', color: '#666', fontSize: '0.82rem', textTransform: 'uppercase' }}>Revenue</th>
										<th style={{ textAlign: 'right', padding: '0.75rem 1rem', color: '#666', fontSize: '0.82rem', textTransform: 'uppercase' }}>Status</th>
									</tr>
								</thead>
								<tbody>
									{topEvents.map((event) => (
										<tr key={event.id} style={{ borderTop: '1px solid #f2f2f2' }}>
											<td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#1a1a2e' }}>{event.title}</td>
											<td style={{ padding: '0.85rem 1rem', color: '#666' }}>{formatDate(getEventDate(event))}</td>
											<td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#1a1a2e' }}>{event.sold}</td>
											<td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#1a1a2e' }}>{event.sellThrough}%</td>
											<td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#E63946', fontWeight: '700' }}>${event.revenue.toFixed(2)}</td>
											<td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
												<span style={{
													display: 'inline-block',
													padding: '0.25rem 0.6rem',
													borderRadius: '999px',
													fontSize: '0.78rem',
													fontWeight: '700',
													textTransform: 'capitalize',
													backgroundColor:
														(event.status || '').toLowerCase() === 'approved' ? '#e9f7ef' :
														(event.status || '').toLowerCase() === 'pending' ? '#fff4e5' : '#fde8e8',
													color:
														(event.status || '').toLowerCase() === 'approved' ? '#15803d' :
														(event.status || '').toLowerCase() === 'pending' ? '#b54708' : '#b42318',
												}}>
													{event.status || 'Unknown'}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
