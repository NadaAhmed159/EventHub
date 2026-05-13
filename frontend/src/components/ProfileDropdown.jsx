import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/serviceFactory';
import { isPendingOrganizer } from '../utils/accountStatus';

export default function ProfileDropdown() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const role = user?.applyAs || 'Participant';
  const roleLabel =
    role === 'EventOrganizer' ? 'Event Organizer' :
    role === 'Admin' ? 'Administrator' :
    'Participant';

  const pendingOrganizer = isPendingOrganizer(user);

  const primaryLink =
    pendingOrganizer
      ? { to: '/account-pending', label: 'Account Pending' }
      : role === 'EventOrganizer'
      ? { to: '/organizer-dashboard', label: 'Dashboard' }
      : role === 'Admin'
        ? { to: '/admin', label: 'Admin Dashboard' }
        : { to: '/dashboard', label: 'Dashboard' };

  const secondaryLink =
    pendingOrganizer
      ? { to: '/reset-password', label: 'Reset Password' }
      : role === 'EventOrganizer'
      ? { to: '/organizer-profile', label: 'Profile' }
      : role === 'Admin'
        ? { to: '/admin/pending-events', label: 'Pending Events' }
        : { to: '/profile', label: 'Edit Profile' };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      logout();
      setIsOpen(false);
      navigate('/login');
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px solid #E63946',
          padding: '2px',
          cursor: 'pointer',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 10px rgba(230, 57, 70, 0.3)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={`${user?.firstName} ${user?.lastName}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
        ) : (
          <span style={{ fontSize: '1.5rem' }}>👤</span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '50px',
          right: '0',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          minWidth: '200px',
          zIndex: 100,
          overflow: 'hidden',
          animation: 'slideDown 0.2s ease-out',
        }}>
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid #e0e0e0',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: "'Lobster', cursive",
              fontSize: '1.2rem',
              color: '#E63946',
              margin: '0',
            }}>
              {user?.username}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#999', margin: '0.25rem 0 0 0' }}>
              {roleLabel}
            </p>
          </div>

          <Link
            to={primaryLink.to}
            onClick={() => setIsOpen(false)}
            style={{
              display: 'block',
              padding: '0.75rem 1rem',
              color: '#333',
              textDecoration: 'none',
              transition: 'all 0.2s',
              fontSize: '0.95rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f3f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            {primaryLink.label}
          </Link>

          <Link
            to={secondaryLink.to}
            onClick={() => setIsOpen(false)}
            style={{
              display: 'block',
              padding: '0.75rem 1rem',
              color: '#333',
              textDecoration: 'none',
              transition: 'all 0.2s',
              fontSize: '0.95rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f3f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            {secondaryLink.label}
          </Link>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: 'none',
              backgroundColor: '#ffffff',
              color: '#E63946',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              fontSize: '0.95rem',
              fontWeight: '600',
              borderTop: '1px solid #e0e0e0',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ffe0e6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            Sign Out
          </button>

          <Link
            to="/reset-password"
            onClick={() => setIsOpen(false)}
            style={{
              display: 'block',
              padding: '0.75rem 1rem',
              color: '#333',
              textDecoration: 'none',
              transition: 'all 0.2s',
              fontSize: '0.95rem',
              borderTop: '1px solid #e0e0e0',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f3f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            Reset Password
          </Link>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
