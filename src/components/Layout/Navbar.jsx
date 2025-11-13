import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  return (
    <nav className="navbar">
      {isMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMenu}></div>}
      <div className="navbar-left">
        <a href="#hero-section" className="navbar-logo-link">
          <img src={logo} alt="The Serene Touch" className="navbar-logo" />
        </a>
        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <a href="#services" onClick={handleLinkClick}>Services</a>
          <a href="#how-it-works" onClick={handleLinkClick}>How It Works</a>
          <a href="#cta-section" onClick={handleLinkClick}>View Availability</a>
        </div>
      </div>
      <div className="navbar-right">
        <a href="#cta-section" className="button button-primary">Book Now</a>
      </div>
      <div className="navbar-mobile-menu" onClick={toggleMenu}>
        <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
