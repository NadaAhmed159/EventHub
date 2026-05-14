import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/serviceFactory';
import { isPendingOrganizer } from '../../utils/accountStatus';

function getLoginErrorMessage(err) {
  const payload = err?.response?.data;

  if (err?.response?.status === 401) {
    if (typeof payload === 'string' && payload.trim()) return payload;
    if (typeof payload?.message === 'string' && payload.message.trim()) return payload.message;
    return 'Invalid email or password.';
  }

  if (typeof payload === 'string' && payload.trim()) return payload;
  if (typeof payload?.message === 'string' && payload.message.trim()) return payload.message;
  return err.message || 'Login failed. Please try again.';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      const { token, expiresAtUtc, user } = response.data;
      login(user, token, expiresAtUtc);
      navigate(isPendingOrganizer(user) ? '/account-pending' : '/');
    } catch (err) {
      setError(getLoginErrorMessage(err));
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3f0' }}>
      <Header />
      <div style={{ maxWidth: '450px', margin: '0 auto', padding: '2rem 1.5rem' }}>
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
              Welcome Back
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#666',
            }}>
              Sign in to your EventsHub account
            </p>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
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
                }}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
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
                }}
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
              {loading ? 'Signing In...' : 'Sign In'}
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
              Don't have an account?{' '}
              <Link to="/register" style={{
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
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
