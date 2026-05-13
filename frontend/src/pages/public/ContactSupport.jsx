import { useState } from 'react';
import Header from '../../components/Header';

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend API
    console.log('Contact form submitted:', formData);
    alert('Thank you for reaching out! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    backgroundColor: '#f8f8f8',
    color: '#333',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3f0' }}>
      <Header />

      {/* Hero Section */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Lobster Two', cursive",
            fontSize: '2.75rem',
            color: '#E63946',
            marginBottom: '1rem',
          }}>
            Contact & Support
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            We're here to help! Get in touch with our support team or find answers to common questions.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          {/* Contact Form */}
          <div>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}>
              <h2 style={{
                fontFamily: "'Lobster Two', cursive",
                fontSize: '1.75rem',
                color: '#1a1a2e',
                marginBottom: '1.5rem',
              }}>
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Name Field */}
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
                    placeholder="Your name"
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
                    placeholder="your@email.com"
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

                {/* Subject Field */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#1a1a2e',
                    marginBottom: '0.5rem',
                  }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
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

                {/* Message Field */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#1a1a2e',
                    marginBottom: '0.5rem',
                  }}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows="5"
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      minHeight: '140px',
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
                  style={{
                    padding: '0.875rem 1rem',
                    backgroundColor: '#E63946',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '0.5rem',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#c92a37';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#E63946';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Support Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Contact Info Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}>
              <h2 style={{
                fontFamily: "'Lobster Two', cursive",
                fontSize: '1.75rem',
                color: '#1a1a2e',
                marginBottom: '1.5rem',
              }}>
                Get In Touch
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Email */}
                <div>
                  <p style={{
                    color: '#E63946',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                  }}>
                    Email
                  </p>
                  <p style={{
                    color: '#1a1a2e',
                    fontSize: '1rem',
                    marginBottom: '0.25rem',
                  }}>
                    support@eventshub.com
                  </p>
                  <p style={{
                    color: '#666',
                    fontSize: '0.9rem',
                  }}>
                    We typically respond within 24 hours
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <p style={{
                    color: '#E63946',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                  }}>
                    Phone
                  </p>
                  <p style={{
                    color: '#1a1a2e',
                    fontSize: '1rem',
                    marginBottom: '0.25rem',
                  }}>
                    1-800-EVENTS1
                  </p>
                  <p style={{
                    color: '#666',
                    fontSize: '0.9rem',
                  }}>
                    Available Monday - Friday, 9am - 6pm EST
                  </p>
                </div>

                {/* Hours */}
                <div>
                  <p style={{
                    color: '#E63946',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                  }}>
                    Business Hours
                  </p>
                  <p style={{
                    color: '#1a1a2e',
                    fontSize: '0.95rem',
                    marginBottom: '0.25rem',
                  }}>
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </p>
                  <p style={{
                    color: '#1a1a2e',
                    fontSize: '0.95rem',
                    marginBottom: '0.25rem',
                  }}>
                    Saturday: 10:00 AM - 4:00 PM
                  </p>
                  <p style={{
                    color: '#1a1a2e',
                    fontSize: '0.95rem',
                  }}>
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Card */}
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              padding: '2rem',
              borderLeft: '4px solid #E63946',
            }}>
              <h3 style={{
                fontFamily: "'Lobster Two', cursive",
                fontSize: '1.5rem',
                color: '#1a1a2e',
                marginBottom: '1rem',
              }}>
                Frequently Asked Questions
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <p style={{
                    fontWeight: '600',
                    color: '#1a1a2e',
                    marginBottom: '0.25rem',
                    fontSize: '0.95rem',
                  }}>
                    How do I cancel my booking?
                  </p>
                  <p style={{
                    color: '#666',
                    fontSize: '0.9rem',
                  }}>
                    You can cancel up to 48 hours before the event for a full refund.
                  </p>
                </div>

                <div>
                  <p style={{
                    fontWeight: '600',
                    color: '#1a1a2e',
                    marginBottom: '0.25rem',
                    fontSize: '0.95rem',
                  }}>
                    How will I receive my tickets?
                  </p>
                  <p style={{
                    color: '#666',
                    fontSize: '0.9rem',
                  }}>
                    Tickets will be sent to your email after confirmation.
                  </p>
                </div>

                <div>
                  <p style={{
                    fontWeight: '600',
                    color: '#1a1a2e',
                    marginBottom: '0.25rem',
                    fontSize: '0.95rem',
                  }}>
                    Can I transfer my tickets?
                  </p>
                  <p style={{
                    color: '#666',
                    fontSize: '0.9rem',
                  }}>
                    Yes, you can transfer tickets to another person through your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
