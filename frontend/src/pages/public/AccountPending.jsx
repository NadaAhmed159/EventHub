import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { userService } from '../../services/serviceFactory';
import { isPendingOrganizer, isRejectedOrganizer } from '../../utils/accountStatus';

export default function AccountPending() {
  const navigate = useNavigate();
  const { user, token, expiresAtUtc, login, logout, isAuthenticated } = useContext(AuthContext);
  const pendingOrganizer = isPendingOrganizer(user);
  const rejectedOrganizer = isRejectedOrganizer(user);

  const { data: serverUser, refetch, isFetching } = useQuery({
    queryKey: ['account-status', user?.id],
    queryFn: async () => {
      try {
        const response = await userService.getUserById(user.id);
        return response.data || null;
      } catch (error) {
        if (error?.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },
    enabled: isAuthenticated && pendingOrganizer && !!user?.id,
    retry: false,
    refetchInterval: pendingOrganizer ? 15000 : false,
  });

  useEffect(() => {
    if (serverUser && isRejectedOrganizer(serverUser)) {
      return;
    }

    if (serverUser && !isPendingOrganizer(serverUser)) {
      const refreshedUser = {
        ...serverUser,
        accountStatus: serverUser.accountStatus || 'Approved',
      };

      login(refreshedUser, token, expiresAtUtc);
      navigate('/organizer-dashboard', { replace: true });
    }
  }, [serverUser, token, expiresAtUtc, login, navigate]);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (rejectedOrganizer) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f3f0' }}>
        <Header />
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '999px', backgroundColor: '#ffe0e6', color: '#E63946', fontWeight: '700', marginBottom: '1rem' }}>
              Account rejected
            </div>
            <h1 style={{ margin: '0 0 0.75rem 0', fontFamily: "'Lobster Two', cursive", fontSize: '2.6rem', color: '#1a1a2e' }}>
              Your organizer application was rejected
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '1.05rem', lineHeight: 1.6 }}>
              An admin rejected this organizer request, so you cannot use organizer features with this account.
            </p>

            <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem', padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f9f7f4' }}>
              <div><strong style={{ color: '#1a1a2e' }}>Email:</strong> {user?.email}</div>
              <div><strong style={{ color: '#1a1a2e' }}>Name:</strong> {user?.firstName} {user?.lastName}</div>
              <div><strong style={{ color: '#1a1a2e' }}>Status:</strong> Rejected by admin</div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                style={{ padding: '0.85rem 1.2rem', borderRadius: '10px', border: 'none', backgroundColor: '#E63946', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pendingOrganizer) {
    navigate('/');
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3f0' }}>
      <Header />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '999px', backgroundColor: '#ffe0e6', color: '#E63946', fontWeight: '700', marginBottom: '1rem' }}>
            Pending approval
          </div>
          <h1 style={{ margin: '0 0 0.75rem 0', fontFamily: "'Lobster Two', cursive", fontSize: '2.6rem', color: '#1a1a2e' }}>
            Your organizer account is waiting for admin review
          </h1>
          <p style={{ margin: 0, color: '#666', fontSize: '1.05rem', lineHeight: 1.6 }}>
            We have created your account request, but you cannot create events or use organizer tools until an admin approves it.
          </p>

          <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem', padding: '1.25rem', borderRadius: '12px', backgroundColor: '#f9f7f4' }}>
            <div><strong style={{ color: '#1a1a2e' }}>Email:</strong> {user?.email}</div>
            <div><strong style={{ color: '#1a1a2e' }}>Name:</strong> {user?.firstName} {user?.lastName}</div>
            <div><strong style={{ color: '#1a1a2e' }}>Status:</strong> Waiting for admin approval</div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              style={{ padding: '0.85rem 1.2rem', borderRadius: '10px', border: 'none', backgroundColor: '#E63946', color: '#fff', fontWeight: '700', cursor: isFetching ? 'not-allowed' : 'pointer' }}
            >
              {isFetching ? 'Checking...' : 'Check approval status'}
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              style={{ padding: '0.85rem 1.2rem', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#1a1a2e', fontWeight: '700', cursor: 'pointer' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}