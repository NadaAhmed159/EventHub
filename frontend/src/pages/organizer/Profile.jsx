import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function OrganizerProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.trim().toUpperCase() || 'U';

  return (
    <div style={{ backgroundColor: '#f5f3f0', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Lobster Two', cursive", fontSize: '2.5rem', color: '#1a1a2e', margin: '0 0 0.5rem 0' }}>
              Organizer Profile
            </h1>
            <p style={{ color: '#666', fontSize: '1rem', margin: 0 }}>Manage your organizer account</p>
          </div>
          <button
            onClick={() => navigate('/edit-organizer-profile')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#E63946',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#c92a37';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#E63946';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Edit Profile
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
          {/* Profile Summary */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 1rem', border: '4px solid #E63946', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E63946', fontSize: '2rem', fontWeight: 800 }}>{initials}</div>
            <h2 style={{ fontSize: '1.5rem', color: '#1a1a2e', margin: '0 0 0.5rem 0', fontWeight: '600' }}>
              {fullName}
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>{user?.email}</p>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#eef7f6',
              color: '#087f5b',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}>
              Event Organizer
            </div>
          </div>

          {/* Profile Information */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}>
            <h3 style={{ fontSize: '1.25rem', color: '#1a1a2e', margin: '0 0 1.5rem 0', fontWeight: '600', borderBottom: '2px solid #E63946', paddingBottom: '0.75rem' }}>
              Account Information
            </h3>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* First Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#999', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  First Name
                </label>
                <p style={{ fontSize: '1rem', color: '#1a1a2e', margin: 0, fontWeight: '500' }}>
                  {user?.firstName || 'Not provided'}
                </p>
              </div>

              {/* Last Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#999', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Last Name
                </label>
                <p style={{ fontSize: '1rem', color: '#1a1a2e', margin: 0, fontWeight: '500' }}>
                  {user?.lastName || 'Not provided'}
                </p>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#999', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Email Address
                </label>
                <p style={{ fontSize: '1rem', color: '#1a1a2e', margin: 0, fontWeight: '500' }}>
                  {user?.email}
                </p>
              </div>

              {/* Company Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#999', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Company Name
                </label>
                <p style={{ fontSize: '1rem', color: '#1a1a2e', margin: 0, fontWeight: '500' }}>
                  {user?.companyName || 'Not provided'}
                </p>
              </div>

              {/* Joined Date */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#999', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Member Since
                </label>
                <p style={{ fontSize: '1rem', color: '#1a1a2e', margin: 0, fontWeight: '500' }}>
                  {formatDate(user?.joinedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

