import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { eventService } from '../../services/eventService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  const { data: pendingAccounts = [] } = useQuery({
    queryKey: ['admin-pending-accounts'],
    queryFn: () => adminService.getPendingAccounts(),
    select: (response) => {
      const payload = response?.data;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.pendingAccounts)) return payload.pendingAccounts;
      if (Array.isArray(payload?.items)) return payload.items;
      return [];
    },
    enabled: isAuthenticated && user?.applyAs === 'Admin',
  });

  const { data: pendingEvents = [] } = useQuery({
    queryKey: ['admin-pending-events'],
    queryFn: () => adminService.getPendingEvents(),
    select: (response) => response.data || [],
    enabled: isAuthenticated && user?.applyAs === 'Admin',
  });

  const { data: allEvents = [] } = useQuery({
    queryKey: ['all-events'],
    queryFn: () => eventService.getAllEvents(),
    select: (response) => response.data || [],
    enabled: isAuthenticated && user?.applyAs === 'Admin',
  });

  if (!isAuthenticated || user?.applyAs !== 'Admin') {
    navigate('/');
    return null;
  }

  const stats = [
    { label: 'Pending accounts', value: pendingAccounts.length, tone: '#b54708' },
    { label: 'Pending events', value: pendingEvents.length, tone: '#b54708' },
    { label: 'Total events', value: allEvents.length, tone: '#1a1a2e' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3f0' }}>
      <Header />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontFamily: "'Lobster Two', cursive", fontSize: '2.7rem', color: '#1a1a2e' }}>Admin Dashboard</h1>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>Review accounts, moderate events, and keep the platform clean.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>{stat.label}</div>
              <div style={{ color: stat.tone, fontSize: '2rem', fontWeight: '800' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button type="button" onClick={() => navigate('/admin/pending-accounts')} style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: 'none', backgroundColor: '#E63946', color: '#fff', fontWeight: '700', cursor: 'pointer' }}>
            Review Accounts
          </button>
          <button type="button" onClick={() => navigate('/admin/pending-events')} style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#1a1a2e', fontWeight: '700', cursor: 'pointer' }}>
            Review Events
          </button>
          <button type="button" onClick={() => navigate('/reset-password')} style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#1a1a2e', fontWeight: '700', cursor: 'pointer' }}>
            Reset Password
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h3 style={{ marginTop: 0, color: '#1a1a2e' }}>Pending accounts</h3>
            <p style={{ color: '#666' }}>{pendingAccounts.length > 0 ? 'Organizer registrations waiting for review.' : 'No account approvals pending.'}</p>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h3 style={{ marginTop: 0, color: '#1a1a2e' }}>Pending events</h3>
            <p style={{ color: '#666' }}>{pendingEvents.length > 0 ? 'Event submissions waiting for moderation.' : 'No event approvals pending.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
