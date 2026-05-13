import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/serviceFactory';
import { isPendingOrganizer } from '../../utils/accountStatus';

export default function Register() {
  const [role, setRole] = useState('Participant');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Split name into firstName and lastName
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      const response = await authService.register({
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        firstName,
        lastName,
        applyAs: role,
      });

      const { token, expiresAtUtc, user } = response.data;
      login(user, token, expiresAtUtc);
      navigate(isPendingOrganizer(user) ? '/account-pending' : '/');
    } catch (err) {
      setError(err.response?.data?.message || err.data?.message || err.message || 'Registration failed. Please try again.');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    backgroundColor: '#f8f8f8',
    color: '#333',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  };

  const buttonStyleBase = {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.95rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3f0' }}>
      <Header />
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '3rem 2rem',
          boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontFamily: "'Lobster Two', cursive",
              fontSize: '2.5rem',
              color: '#E63946',
              marginBottom: '0.5rem',
            }}>
              Create Account
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#666',
            }}>
              Join EventsHub and start exploring events
            </p>
          </div>

          {/* Role Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#1a1a2e',
              marginBottom: '0.75rem',
            }}>
              Register as
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRole('Participant')}
                style={{
                  ...buttonStyleBase,
                  backgroundColor: role === 'Participant' ? '#E63946' : '#f0f0f0',
                  color: role === 'Participant' ? '#ffffff' : '#666',
                }}
                onMouseEnter={(e) => {
                  if (role !== 'Participant') {
                    e.target.style.backgroundColor = '#e0e0e0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (role !== 'Participant') {
                    e.target.style.backgroundColor = '#f0f0f0';
                  }
                }}
              >
                Participant
              </button>
              <button
                type="button"
                onClick={() => setRole('EventOrganizer')}
                style={{
                  ...buttonStyleBase,
                  backgroundColor: role === 'EventOrganizer' ? '#E63946' : '#f0f0f0',
                  color: role === 'EventOrganizer' ? '#ffffff' : '#666',
                }}
                onMouseEnter={(e) => {
                  if (role !== 'EventOrganizer') {
                    e.target.style.backgroundColor = '#e0e0e0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (role !== 'EventOrganizer') {
                    e.target.style.backgroundColor = '#f0f0f0';
                  }
                }}
              >
                Organizer
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#ffe0e6',
              border: '1px solid #E63946',
              color: '#E63946',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Full Name Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#1a1a2e',
                marginBottom: '0.5rem',
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#E63946';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.backgroundColor = '#f8f8f8';
                }}
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#1a1a2e',
                marginBottom: '0.5rem',
              }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1 555 123 4567"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#E63946';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.backgroundColor = '#f8f8f8';
                }}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#1a1a2e',
                marginBottom: '0.5rem',
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#E63946';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.backgroundColor = '#f8f8f8';
                }}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#1a1a2e',
                marginBottom: '0.5rem',
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#E63946';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.backgroundColor = '#f8f8f8';
                }}
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#1a1a2e',
                marginBottom: '0.5rem',
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#E63946';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.backgroundColor = '#f8f8f8';
                }}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                backgroundColor: loading ? '#ccc' : '#E63946',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '0.5rem',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#c92a37';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#E63946';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer Link */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #f0f0f0',
            textAlign: 'center',
          }}>
            <p style={{ color: '#666', fontSize: '0.95rem', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{
                color: '#E63946',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#c92a37';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#E63946';
              }}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
