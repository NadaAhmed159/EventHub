import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import SignUpModal from '../../components/SignUpModal';

export default function SignUp() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'participant',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      alert('Please fill all fields');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      alert('Please enter your phone number');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      alert('Password must be at least 8 characters');
      return;
    }
    if (!passwordPattern.test(formData.password)) {
      alert('Password must include uppercase, lowercase, and a special character.');
      return;
    }
    setShowModal(true);
  };

  const handleSignUpComplete = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Header />
      <div style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#f5f3f0',
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '3rem',
          maxWidth: '450px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}>
          <h1 style={{
            fontFamily: "'Lobster', cursive",
            fontSize: '2rem',
            color: '#1a1a2e',
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}>
            Create Account
          </h1>
          <p style={{
            color: '#666',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '0.95rem',
          }}>
            Join EventsHub and discover amazing events
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#E63946'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+1 555 123 4567"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#E63946'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#E63946'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#E63946'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p style={{ color: '#E63946', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  ✗ Passwords do not match
                </p>
              )}
              {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p style={{ color: '#4CAF50', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  ✓ Passwords match
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                I want to be a:
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                }}
              >
                <option value="participant">Participant (Attend Events)</option>
                <option value="organizer">Organizer (Host Events)</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                backgroundColor: '#E63946',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#c92a37'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#E63946'}
            >
              Continue to Setup
            </button>

            <p style={{ color: '#666', textAlign: 'center', fontSize: '0.9rem' }}>
              Already have an account? <a href="/login" style={{ color: '#E63946', textDecoration: 'none', fontWeight: '600' }}>Login</a>
            </p>
          </form>
        </div>
      </div>

      {showModal && <SignUpModal onClose={handleSignUpComplete} initialData={formData} />}
    </div>
  );
}
