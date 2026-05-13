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

export default function PendingAccounts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [error, setError] = useState('');

  const { data: pendingAccounts = [], isLoading: loading } = useQuery({
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

  const approveMutation = useMutation({
    mutationFn: (organizerId) => adminService.approveOrganizer(organizerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-accounts'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (organizerId) => adminService.rejectOrganizer(organizerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-accounts'] });
    },
  });

  if (!isAuthenticated || user?.applyAs !== 'Admin') {
    navigate('/');
    return null;
  }

  const handleApprove = async (account) => {
    try {
      setError('');
      await approveMutation.mutateAsync(account.id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve account');
    }
  };

  const handleReject = async (account) => {
    try {
      setError('');
      await rejectMutation.mutateAsync(account.id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject account');
    }
  };

  const actionLoading = approveMutation.isPending || rejectMutation.isPending;
  const totalPending = pendingAccounts.length;

  return (
    <div style={{ backgroundColor: '#f5f3f0', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 style={{ fontFamily: 'Lobster, cursive', fontSize: '2.5rem', color: '#1a1a2e', marginBottom: '2rem' }}>
          Pending Organizer Accounts
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
            <span style={{ color: '#666', fontSize: '0.9rem' }}>Accounts waiting review:</span>
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
          <p style={{ textAlign: 'center', color: '#666' }}>Loading pending organizer accounts...</p>
        ) : pendingAccounts.length === 0 ? (
          <div style={{
            backgroundColor: '#fff',
            padding: '3rem',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>No pending accounts to review.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {pendingAccounts.map((account) => (
              <div key={account.id} style={{
                backgroundColor: '#fff',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a1a2e' }}>{`${account.firstName || ''} ${account.lastName || ''}`.trim() || account.name || 'Organizer account'}</h3>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Email: {account.email}</p>
                  {account.companyName && (
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Company: {account.companyName}</p>
                  )}
                  <p style={{ margin: '0', color: '#999', fontSize: '0.9rem' }}>Applied on: {formatDate(account.appliedAt)}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => handleApprove(account)}
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
                    onClick={() => handleReject(account)}
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
