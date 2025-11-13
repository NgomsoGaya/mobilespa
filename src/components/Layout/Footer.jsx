import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-column">
          <h4>Contact Info</h4>
          <p>+1 (123) 456-7890</p>
          <p>contact@serenetouch.com</p>
          <p>Mon - Sun: 9am - 8pm</p>
        </div>
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="social-icons">
            {/* Add social icons here */}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 The Serene Touch. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
