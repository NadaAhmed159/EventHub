import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { useCategories } from '../../hooks/useCategories';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    categoryId: '',
    eventDate: '',
    eventTime: '',
    ticketPrice: '',
    totalTickets: '',
    image: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const baseTicketPrice = Number(formData.ticketPrice) || 0;
  const ticketTiers = useMemo(() => ([
    { label: 'Standard', price: baseTicketPrice },
    { label: 'VIP', price: baseTicketPrice * 1.5 },
    { label: 'Premium', price: baseTicketPrice * 2 },
  ]), [baseTicketPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.title ||
      !formData.description ||
      !formData.venue ||
      !formData.categoryId ||
      !formData.eventDate ||
      !formData.eventTime ||
      !formData.ticketPrice ||
      !formData.totalTickets
    ) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const eventPayload = {
        title: formData.title,
        description: formData.description,
        venue: formData.venue,
        categoryId: formData.categoryId,
        eventDate: `${formData.eventDate}T${formData.eventTime}:00`,
        price: parseFloat(formData.ticketPrice),
        totalTickets: parseInt(formData.totalTickets, 10),
        availableTickets: parseInt(formData.totalTickets, 10),
        image: formData.image,
        organizerId: user.id,
      };

      await eventService.createEvent(eventPayload);
      navigate('/my-events', {
        state: {
          justCreatedPendingEvent: true,
          eventTitle: formData.title,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
      console.error('Create event error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.applyAs !== 'EventOrganizer') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f3f0' }}>
        <Header />
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Only event organizers can create events.</p>
        </div>
      </div>
    );
  }

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

  const focusStyle = {
    borderColor: '#E63946',
    backgroundColor: '#ffffff',
  };

  const blurStyle = {
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  };

  return (
    <div style={{ backgroundColor: '#f5f3f0', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1
              style={{
                fontFamily: "'Lobster Two', cursive",
                fontSize: '2.5rem',
                color: '#E63946',
                marginBottom: '0.5rem',
              }}
            >
              Create Event
            </h1>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>
              Fill in the details below to create your event
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#ffe0e6',
                border: '1px solid #E63946',
                color: '#E63946',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event..."
                rows="4"
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                Venue *
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Event venue/location"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                required
              >
                <option value="">Select a category</option>
                {Array.isArray(categories) && categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {categoriesLoading && (
                <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
                  Loading categories...
                </p>
              )}
              {!categoriesLoading && Array.isArray(categories) && categories.length === 0 && (
                <p style={{ marginTop: '0.5rem', color: '#b45309', fontSize: '0.85rem' }}>
                  No categories available yet. Ask an admin to create categories first.
                </p>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                  Event Date *
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                  Event Time *
                </label>
                <input
                  type="time"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                  Base Ticket Price ($) *
                </label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                  required
                />
                <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
                  This base price is used to show Standard, VIP, and Premium ticket options.
                </p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                  Total Tickets *
                </label>
                <input
                  type="number"
                  name="totalTickets"
                  value={formData.totalTickets}
                  onChange={handleChange}
                  placeholder="0"
                  min="1"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                  required
                />
              </div>
            </div>

            <div style={{ backgroundColor: '#f9f7f4', borderRadius: '10px', padding: '1rem 1.1rem', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <strong style={{ color: '#1a1a2e' }}>Ticket tiers preview</strong>
                <span style={{ color: '#666', fontSize: '0.85rem' }}>Based on the base ticket price above</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                {ticketTiers.map((tier) => (
                  <div key={tier.label} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '0.85rem', border: '1px solid #eee' }}>
                    <div style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '0.2rem' }}>{tier.label}</div>
                    <div style={{ color: '#E63946', fontSize: '1.05rem', fontWeight: '800' }}>
                      ${tier.price > 0 ? tier.price.toFixed(2) : '0.00'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                Event Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  ...inputStyle,
                  padding: '0.5rem',
                }}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, blurStyle)}
              />
              {imagePreview && (
                <div style={{ marginTop: '1rem' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      border: '2px solid #E63946',
                    }}
                  />
                </div>
              )}
            </div>

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
                marginTop: '1rem',
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
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
