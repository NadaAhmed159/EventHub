import { useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/serviceFactory';
import { isPendingOrganizer } from '../utils/accountStatus';

function getApiErrorMessage(error) {
  const payload = error?.response?.data;

  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message;
  }

  if (typeof payload?.detail === 'string' && payload.detail.trim()) {
    return payload.detail;
  }

  if (typeof payload?.title === 'string' && payload.title.trim()) {
    return payload.title;
  }

  if (payload?.errors && typeof payload.errors === 'object') {
    const firstErrorGroup = Object.values(payload.errors).find(
      (messages) => Array.isArray(messages) && messages.length > 0
    );
    if (firstErrorGroup) {
      return firstErrorGroup[0];
    }
  }

  return error?.message || 'Failed to create account. Please try again.';
}

export default function SignUpModal({ onClose, initialData }) {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    agreedToLicense: false,
    firstName: '',
    lastName: '',
  });

  const handleNext = () => {
    // validations per step
    if (step === 1 && !formData.agreedToLicense) {
      setError('Please agree to the terms');
      return;
    }
    if (step === 2 && !formData.firstName.trim()) {
      setError('Please enter your first name');
      return;
    }
    if (step === 3 && !formData.lastName.trim()) {
      setError('Please enter your last name');
      return;
    }
    if (step === 4 && !formData.username.trim()) {
      setError('Please enter a username');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleComplete = async () => {
    setError('');
    setLoading(true);

    try {
      // Use collected names if provided, otherwise fall back to initialData heuristics
      const firstName = formData.firstName?.trim() || (initialData?.fullName || '').trim().split(' ')[0] || initialData?.username || 'User';
      const lastName = formData.lastName?.trim() || (initialData?.fullName || '').trim().split(' ').slice(1).join(' ') || '';

      // Map role from signup form to API enum
      const normalizedRole = String(initialData?.role || '').trim().toLowerCase();
      const roleMap = {
        participant: 'Participant',
        organizer: 'EventOrganizer',
        eventorganizer: 'EventOrganizer',
        'event-organizer': 'EventOrganizer',
      };

      const response = await authService.register({
        email: initialData?.email,
        phoneNumber: initialData?.phoneNumber || '',
        password: initialData?.password,
        firstName,
        lastName,
        applyAs: roleMap[normalizedRole] || 'Participant',
      });

      const { token, expiresAtUtc, user } = response.data;

      // Merge in username from signup modal
      const userWithUsername = {
        ...user,
        username: formData.username,
        firstName,
        lastName,
      };

      login(userWithUsername, token, expiresAtUtc);
      navigate(isPendingOrganizer(userWithUsername) ? '/account-pending' : '/');
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err));
      console.error('SignUp error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}} onClick={onClose}>
      <div style={{backgroundColor: '#fff', borderRadius: '12px', padding: '3rem', maxWidth: '500px', width: '90%', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'}} onClick={(e) => e.stopPropagation()}>
        <div style={{display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center'}}>
          {[1, 2, 3, 4, 5].map(n => <div key={n} style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: n <= step ? '#E63946' : '#e0e0e0'}} />)}
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

        {step === 1 && (
          <div>
            <h2 style={{fontFamily: "'Lobster', cursive", fontSize: '1.75rem', color: '#1a1a2e', marginBottom: '1.5rem'}}>Accept License</h2>
            <div style={{backgroundColor: '#f5f3f0', padding: '1.5rem', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem'}}>
              <p><strong>EventsHub Terms of Service</strong></p>
              <ul><li>Follow all laws</li><li>No harmful activities</li><li>Respect privacy</li></ul>
            </div>
            <label style={{display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer'}}>
              <input type="checkbox" checked={formData.agreedToLicense} onChange={(e) => setFormData({...formData, agreedToLicense: e.target.checked})} style={{width: '20px', height: '20px'}} />
              <span>I agree to Terms</span>
            </label>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{fontFamily: "'Lobster', cursive", fontSize: '1.75rem', color: '#1a1a2e', marginBottom: '1.5rem'}}>First Name</h2>
            <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="First name" style={{width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', boxSizing: 'border-box'}} />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{fontFamily: "'Lobster', cursive", fontSize: '1.75rem', color: '#1a1a2e', marginBottom: '1.5rem'}}>Last Name</h2>
            <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="Last name" style={{width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', boxSizing: 'border-box'}} />
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{fontFamily: "'Lobster', cursive", fontSize: '1.75rem', color: '#1a1a2e', marginBottom: '1.5rem'}}>Create Username</h2>
            <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} placeholder="Enter username" style={{width: '100%', padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '8px', boxSizing: 'border-box'}} />
          </div>
        )}
        {step === 5 && (
          <div style={{textAlign: 'center'}}>
            <h2 style={{fontFamily: "'Lobster', cursive", fontSize: '1.75rem', color: '#1a1a2e', marginBottom: '1.5rem'}}>Welcome!</h2>
            <p>Your account <strong style={{color: '#E63946'}}>{formData.username}</strong> is ready!</p>
          </div>
        )}

        <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              disabled={loading}
              style={{flex: 1, padding: '0.75rem', backgroundColor: loading ? '#ccc' : '#f5f3f0', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer'}}
            >
              Back
            </button>
          )}
          {step < 5 && (
            <button
              onClick={handleNext}
              disabled={loading}
              style={{flex: 1, padding: '0.75rem', backgroundColor: loading ? '#ccc' : '#E63946', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer'}}
            >
              Next
            </button>
          )}
          {step === 5 && (
            <button
              onClick={handleComplete}
              disabled={loading}
              style={{flex: 1, padding: '0.75rem', backgroundColor: loading ? '#ccc' : '#E63946', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer'}}
            >
              {loading ? 'Creating Account...' : 'Start'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
