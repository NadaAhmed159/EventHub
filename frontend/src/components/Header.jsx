import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import ProfileDropdown from './ProfileDropdown';
import { isPendingOrganizer } from '../utils/accountStatus';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { notifications = [], unreadCount, markNotificationAsRead } = useContext(NotificationContext);
  const pendingOrganizer = isPendingOrganizer(user);

  const isEventsPage = location.pathname === '/events';

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (isEventsPage) {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }
      setSearchParams(params);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!isEventsPage && searchTerm) {
      navigate(`/events?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (isEventsPage) {
      const params = new URLSearchParams(searchParams);
      params.delete('search');
      setSearchParams(params);
    }
  };

  return (
    <header>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          EventsHub
        </Link>

        {/* Search Bar - Only show on /events page */}
        {isEventsPage && (
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  width: '100%',
                  paddingLeft: '1rem',
                  paddingRight: searchTerm ? '2.25rem' : '1rem',
                  paddingTop: '0.6rem',
                  paddingBottom: '0.6rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '25px',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s',
                  boxSizing: 'border-box',
                  backgroundColor: '#f8f8f8',
                  color: '#333',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#E63946';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.backgroundColor = '#f8f8f8';
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#e0e0e0',
                    color: '#666',
                    border: 'none',
                    borderRadius: '50%',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#E63946';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#e0e0e0';
                    e.target.style.color = '#666';
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </form>
        )}

        {/* Desktop Navigation */}
        <ul className="nav-menu">
          <li><Link to="/events">Events</Link></li>
          
          {/* Participant Navigation */}
          {isAuthenticated && user?.applyAs === 'Participant' && !pendingOrganizer && (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/my-tickets">My Tickets</Link></li>
              <li><Link to="/favorites">Favorites</Link></li>
              <li><Link to="/my-reviews">My Reviews</Link></li>
            </>
          )}

          {/* Organizer Navigation */}
          {isAuthenticated && user?.applyAs === 'EventOrganizer' && !pendingOrganizer && (
            <>
              <li><Link to="/organizer-dashboard">Dashboard</Link></li>
              <li><Link to="/organizer-analytics">Analytics</Link></li>
              <li><Link to="/my-events">My Events</Link></li>
              <li><Link to="/create-event">Create Event</Link></li>
              <li><Link to="/organizer-reviews">Reviews</Link></li>
              <li><Link to="/organizer-profile">Profile</Link></li>
            </>
          )}

          {/* Admin Navigation */}
          {isAuthenticated && user?.applyAs === 'Admin' && (
            <>
              <li><Link to="/admin">Admin Dashboard</Link></li>
              <li><Link to="/admin/pending-accounts">Pending Accounts</Link></li>
              <li><Link to="/admin/pending-events">Pending Events</Link></li>
              <li><Link to="/admin/reviews">Platform Reviews</Link></li>
            </>
          )}

          <li><Link to="/contact">Contact & Support</Link></li>
        </ul>

        {/* Nav Icons */}
        <div className="nav-icons">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {!pendingOrganizer && (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    style={{
                      position: 'relative',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '2px solid #E63946',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
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
                    🔔
                    <span style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#E63946',
                      color: '#ffffff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}>
                      {unreadCount}
                    </span>
                  </button>

                  {notificationsOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '50px',
                      right: '-10px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                      minWidth: '320px',
                      maxWidth: '350px',
                      zIndex: 100,
                      overflow: 'hidden',
                    }}>
                      <div style={{ padding: '1rem', borderBottom: '1px solid #e0e0e0' }}>
                        <h3 style={{ margin: '0', color: '#1a1a2e', fontSize: '1rem', fontWeight: '600' }}>
                          Notifications ({unreadCount})
                        </h3>
                      </div>
                      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              style={{
                                padding: '1rem',
                                borderBottom: '1px solid #e0e0e0',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: '#ffffff',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f5f3f0';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#ffffff';
                              }}
                              onClick={() => {
                                if (notif.unread) {
                                  markNotificationAsRead(notif.id);
                                }
                              }}
                            >
                              <p style={{ margin: '0 0 0.25rem 0', color: '#333', fontSize: '0.95rem', lineHeight: '1.4' }}>
                                {notif.message || notif.title || 'Notification'}
                              </p>
                              <p style={{ margin: '0', color: '#999', fontSize: '0.8rem' }}>
                                {notif.time || notif.createdAt || notif.createdAtUtc || ''}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                            No notifications
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!pendingOrganizer ? <ProfileDropdown /> : (
                <Link to="/account-pending" style={{ color: '#E63946', fontWeight: '700', textDecoration: 'none' }}>
                  Pending Review
                </Link>
              )}

              {!pendingOrganizer && (
                <span style={{ color: '#333', fontWeight: '500', fontFamily: "'Lobster', cursive", fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                  {user?.username}
                </span>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/signup"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#E63946',
                  border: '2px solid #E63946',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#E63946';
                  e.target.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#E63946';
                }}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#E63946',
                  color: '#ffffff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#c92a37';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#E63946';
                }}
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#333',
            padding: '0.5rem',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: '#333',
              textDecoration: 'none',
              padding: '0.5rem 0',
              fontWeight: '500',
            }}
          >
            Events
          </Link>

          {/* Participant Mobile Menu */}
          {isAuthenticated && user?.applyAs === 'Participant' && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/my-tickets"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                My Tickets
              </Link>
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                Favorites
              </Link>
              <Link
                to="/my-reviews"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                My Reviews
              </Link>
            </>
          )}

          {/* Organizer Mobile Menu */}
          {isAuthenticated && user?.applyAs === 'EventOrganizer' && (
            <>
              <Link
                to="/organizer-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/organizer-analytics"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                Analytics
              </Link>
              <Link
                to="/my-events"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                My Events
              </Link>
              <Link
                to="/create-event"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                Create Event
              </Link>
              <Link
                to="/organizer-reviews"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                Reviews
              </Link>
              <Link
                to="/organizer-profile"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                Profile
              </Link>
            </>
          )}

          {/* Admin Mobile Menu */}
          {isAuthenticated && user?.applyAs === 'Admin' && (
            <>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/pending-accounts"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                Pending Accounts
              </Link>
              <Link
                to="/admin/pending-events"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                Pending Events
              </Link>
              <Link
                to="/admin/reviews"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#333',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                  fontWeight: '500',
                }}
              >
                Platform Reviews
              </Link>
            </>
          )}

          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: '#333',
              textDecoration: 'none',
              padding: '0.5rem 0',
              fontWeight: '500',
            }}
          >
            Contact & Support
          </Link>
          {!isAuthenticated && (
            <>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#E63946',
                  border: '2px solid #E63946',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  marginTop: '0.5rem',
                  display: 'block',
                  transition: 'all 0.3s',
                }}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: '#E63946',
                  color: '#ffffff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  marginTop: '0.5rem',
                  display: 'block',
                }}
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}