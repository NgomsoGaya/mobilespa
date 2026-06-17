import React, { useState } from 'react';
import './Footer.css';
import instagramIcon from '../../assets/images/instagram.svg';
import whatsappIcon from '../../assets/images/whatsapp.svg';
import ContactModal from '../../ContactModal/contactModal';

const Footer = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-column">
          <h4>Contact Info</h4>
          <p>+27 77 447 8258</p>
          <p>
            <button 
              className="footer-email-btn" 
              onClick={() => setIsContactModalOpen(true)}
              style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
            >
              contact@wellnessmobilespa.com
            </button>
          </p>
          <p>Mon - Sun: 9am - 8pm</p>
          <p>Providing mobile spa treatments in Cape Town CBD, Sea Point, Green Point, Bantry Bay, Clifton, and Camps Bay.</p>
        </div>
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#services">Services</a></li>
            <li><a href="#about-us-section">About</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-column footer-column-center">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://instagram.com/wellness_mobile_sa" target="_blank" className="social-btn instagram">
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a href="https://wa.me/+27774478258" target="_blank" className="social-btn whatsapp">
              <img src={whatsappIcon} alt="WhatsApp" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Wellness Mobile Spa. All Rights Reserved.</p>
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </footer>
  );
};

export default Footer;
