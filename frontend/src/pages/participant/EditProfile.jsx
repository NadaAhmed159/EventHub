import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { userService } from '../../services/userService';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError('First name and last name are required.');
        setLoading(false);
        return;
      }

      const updatedUser = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
      };

      const response = await userService.updateUser(user.id, updatedUser);
      const updatedUserData = response.data || response;

      login(updatedUserData, localStorage.getItem('token'), localStorage.getItem('expiresAtUtc'));

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f3f0', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
<div>
            <h1 style={{ fontFamily: "'Lobster Two', cursive", fontSize: '2.5rem', color: '#1a1a2e', margin: '0 0 0.5rem 0' }}>
              Edit Profile
            </h1>
            <p style={{ color: '#666', fontSize: '1rem', margin: 0 }}>Update your account information</p>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}>
          {error && (
            <div style={{
              backgroundColor: '#ffe0e6',
              border: '1px solid #E63946',
              color: '#E63946',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: '#d4edda',
              border: '1px solid #28a745',
              color: '#155724',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#1a1a2e',
                marginBottom: '0.5rem',
              }}>
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
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

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#1a1a2e',
                marginBottom: '0.5rem',
              }}>
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
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
                disabled
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  backgroundColor: '#f0f0f0',
                  color: '#999',
                  boxSizing: 'border-box',
                  cursor: 'not-allowed',
                }}
              />
              <p style={{ fontSize: '0.8rem', color: '#999', margin: '0.5rem 0 0 0' }}>Email cannot be changed</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                style={{
                  flex: 1,
                  padding: '0.875rem 1rem',
                  backgroundColor: '#f5f3f0',
                  color: '#1a1a2e',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e0e0e0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f5f3f0';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.875rem 1rem',
                  backgroundColor: loading ? '#ccc' : '#E63946',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
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
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
