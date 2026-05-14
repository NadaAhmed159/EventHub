import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ticketService } from '../../services/ticketService';
import './TicketVerify.css';

export default function TicketVerify() {
  const { qrCode } = useParams();
  const navigate = useNavigate();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyTicket = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ticketService.verifyTicketByQrCode(qrCode);
        setVerification(response?.data || response);
      } catch (err) {
        console.error('Verification error:', err);
        let errorMsg = 'Failed to verify ticket. QR code may be invalid or the ticket may have been used.';
        
        if (err.response?.status === 400) {
          errorMsg = 'This ticket has already been used or is invalid.';
        } else if (err.response?.status === 404) {
          errorMsg = 'Ticket not found. This QR code may be expired or invalid.';
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (qrCode) {
      verifyTicket();
    }
  }, [qrCode]);

  if (loading) {
    return (
      <div className="verify-container">
        <div className="verify-card loading">
          <div className="spinner"></div>
          <p>Verifying ticket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verify-container">
        <div className="verify-card error">
          <div className="error-icon">✗</div>
          <h2>Ticket Verification Failed</h2>
          <p className="error-message">{error}</p>
          <button style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '20px'
          }} onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="verify-container">
        <div className="verify-card error">
          <div className="error-icon">✗</div>
          <h2>Ticket Not Found</h2>
          <p className="error-message">No valid ticket data found.</p>
          <button style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '20px'
          }} onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { ticketId, eventTitle, eventDate, venue, participantFullName, participantEmail, participantPhoneNumber, purchasedAt, verifiedAtUtc } = verification;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="verify-container">
      <div className="verify-card success">
        <div className="success-icon">✓</div>
        <h1>Ticket Verified</h1>
        
        <div className="ticket-details">
          <div className="detail-section">
            <h3>Event Information</h3>
            <div className="detail-row">
              <span className="label">Event:</span>
              <span className="value">{eventTitle}</span>
            </div>
            <div className="detail-row">
              <span className="label">Date:</span>
              <span className="value">{formatDate(eventDate)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Venue:</span>
              <span className="value">{venue}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Participant Information</h3>
            <div className="detail-row">
              <span className="label">Name:</span>
              <span className="value">{participantFullName}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{participantEmail || 'Not provided'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Phone:</span>
              <span className="value">{participantPhoneNumber || 'Not provided'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Ticket ID:</span>
              <span className="value ticket-id">{ticketId}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Purchase Information</h3>
            <div className="detail-row">
              <span className="label">Purchased:</span>
              <span className="value">{formatDate(purchasedAt)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Verified:</span>
              <span className="value">{formatDate(verifiedAtUtc)}</span>
            </div>
          </div>
        </div>

        <button style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          padding: '12px 30px',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          marginTop: '20px'
        }} onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
