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
          <a href="#cta-section" onClick={handleLinkClick}>How to book</a>
          <a href="#about-us-section" onClick={handleLinkClick}>About Us</a>
          <a href="#vouchers-section" onClick={handleLinkClick}>Vouchers</a>
          <a href="#price-list-section" onClick={handleLinkClick}>Price List</a>
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
