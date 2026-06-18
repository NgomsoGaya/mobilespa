import React, { useState } from 'react';
import './ContactModal.css';
<<<<<<< HEAD
import { API_BASE } from '../apiConfig';
=======
>>>>>>> backend-production

const ContactModal = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
<<<<<<< HEAD
      const response = await fetch(`${API_BASE}/api/contact`, {
=======
      const response = await fetch("/api/contact", {
>>>>>>> backend-production
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        e.target.reset();
      } else {
        console.error("Error", result);
        setStatus('error');
      }
    } catch (error) {
      console.error("Error", error);
      setStatus('error');
    }
  };


  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <div className="modal-header">
          <span className="modal-eyebrow">Get in touch</span>
          <h2 id="modal-title">Send us a message</h2>
          <p>We'll get back to you within 24 hours.</p>
        </div>

        {status === 'success' ? (
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <h3>Message sent!</h3>
            <p>Thank you for reaching out. We'll be in touch soon.</p>
            <button className="btn-primary" onClick={onClose} style={{ marginTop: '1rem' }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="contact-name">Your name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Jane Smith"
                required
                disabled={status === 'sending'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email">Your email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                required
                disabled={status === 'sending'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows="4"
                placeholder="How can we help you?"
                required
                disabled={status === 'sending'}
              />
            </div>

            {status === 'error' && (
              <p className="form-error" style={{ color: 'red', marginBottom: '1rem' }}>
                Something went wrong. Please try again or WhatsApp us directly.
              </p>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={status === 'sending'}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#4a7c59',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
