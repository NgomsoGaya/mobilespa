import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/images/logo.png';
import AboutUsContent from '../SheetContent/AboutUsContent';
import ServicesContent from '../SheetContent/ServicesContent';
import PriceListContent from '../SheetContent/PriceListContent';
import VouchersContent from '../SheetContent/VouchersContent';
import HowItWorksContent from '../SheetContent/HowItWorksContent';
import HowToBookContent from '../SheetContent/HowToBookContent';

const Navbar = ({ openSheet, howToBookButtonRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (e, title, contentComponent) => {
    e.preventDefault();
    openSheet(title, contentComponent);
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
          <a href="#" onClick={(e) => handleLinkClick(e, 'About Us', AboutUsContent)}>About Us</a>
          <a href="#" onClick={(e) => handleLinkClick(e, 'Our Services', ServicesContent)}>Services</a>
          <a href="#" onClick={(e) => handleLinkClick(e, 'Our Services & Pricing', PriceListContent)}>Price List</a>
          <a href="#" onClick={(e) => handleLinkClick(e, 'Gift or Redeem a Voucher', VouchersContent)}>Vouchers</a>
          <a href="#" onClick={(e) => handleLinkClick(e, 'How To Book', HowToBookContent)} ref={howToBookButtonRef}>How to book</a>
          <a href="#" onClick={(e) => handleLinkClick(e, 'How It Works', HowItWorksContent)}>How It Works</a>
        </div>
      </div>
      <div className="navbar-right">
        <a href="#" className="button button-primary" onClick={(e) => handleLinkClick(e, 'How To Book', HowToBookContent)}>Book Now</a>
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

