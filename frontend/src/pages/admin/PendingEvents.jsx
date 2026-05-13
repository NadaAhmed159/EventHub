import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';

function formatDate(value) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PendingEvents() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [error, setError] = useState('');

  const { data: pendingEvents = [], isLoading: loading } = useQuery({
    queryKey: ['admin-pending-events'],
    queryFn: () => adminService.getPendingEvents(),
    select: (response) => {
      const payload = response?.data;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.pendingEvents)) return payload.pendingEvents;
      if (Array.isArray(payload?.items)) return payload.items;
      return [];
    },
    enabled: isAuthenticated && user?.applyAs === 'Admin',
  });

  const approveMutation = useMutation({
    mutationFn: (eventId) => adminService.approveEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-events'] });
      queryClient.invalidateQueries({ queryKey: ['approved-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (eventId) => adminService.rejectEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-events'] });
    },
  });

  if (!isAuthenticated || user?.applyAs !== 'Admin') {
    navigate('/');
    return null;
  }

  const handleApprove = async (eventId) => {
    try {
      setError('');
      await approveMutation.mutateAsync(eventId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve event');
    }
  };

  const handleReject = async (eventId) => {
    try {
      setError('');
      await rejectMutation.mutateAsync(eventId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject event');
    }
  };

  const actionLoading = approveMutation.isPending || rejectMutation.isPending;
  const totalPending = pendingEvents.length;

  return (
    <div style={{ backgroundColor: '#f5f3f0', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontFamily: 'Lobster, cursive', fontSize: '2.5rem', color: '#1a1a2e', marginBottom: '2rem' }}>
          Pending Events
        </h1>

        {!loading && (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>Events waiting review:</span>
            <strong style={{ color: '#E63946', fontSize: '1.2rem' }}>{totalPending}</strong>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#ffe0e6',
            border: '1px solid #E63946',
            color: '#E63946',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Loading pending events...</p>
        ) : pendingEvents.length === 0 ? (
          <div style={{
            backgroundColor: '#fff',
            padding: '3rem',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>No pending events to review.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {pendingEvents.map((event) => (
              <div key={event.id} style={{
                backgroundColor: '#fff',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a1a2e' }}>{event.title}</h3>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Organizer: {event.organizerName || `${event.organizer?.firstName || ''} ${event.organizer?.lastName || ''}`.trim() || event.organizerId || 'Unknown'}</p>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Date: {formatDate(event.eventDate)}</p>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Venue: {event.venue}</p>
                  <p style={{ margin: '0', color: '#999', fontSize: '0.9rem' }}>Submitted: {formatDate(event.submittedAt || event.createdAt)}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => handleApprove(event.id)}
                    disabled={actionLoading}
                    style={{
                      padding: '0.5rem 1.5rem',
                      backgroundColor: actionLoading ? '#96d8a5' : '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      opacity: actionLoading ? 0.8 : 1,
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(event.id)}
                    disabled={actionLoading}
                    style={{
                      padding: '0.5rem 1.5rem',
                      backgroundColor: actionLoading ? '#e6a1a7' : '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      opacity: actionLoading ? 0.8 : 1,
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
