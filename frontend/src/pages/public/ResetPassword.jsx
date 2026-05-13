import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { userService } from '../../services/userService';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setFormData((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await userService.resetPassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess('Password updated successfully. Please sign in again.');
      logout();

      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.data?.message || err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3f0' }}>
      <Header />
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 2px 15px rgba(0,0,0,0.08)' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontFamily: "'Lobster Two', cursive", fontSize: '2.4rem', color: '#1a1a2e', margin: 0 }}>Reset Password</h1>
            <p style={{ color: '#666', marginTop: '0.5rem' }}>Update the password for {user?.email}</p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#ffe0e6', border: '1px solid #E63946', color: '#E63946', padding: '0.9rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ backgroundColor: '#eafaf1', border: '1px solid #16a34a', color: '#166534', padding: '0.9rem 1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a2e' }}>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '2px solid #e0e0e0', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a2e' }}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={8}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '2px solid #e0e0e0', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a1a2e' }}>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '2px solid #e0e0e0', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => navigate(-1)} style={{ flex: 1, padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff', fontWeight: '700', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading} style={{ flex: 1, padding: '0.85rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: loading ? '#ccc' : '#E63946', color: '#fff', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
