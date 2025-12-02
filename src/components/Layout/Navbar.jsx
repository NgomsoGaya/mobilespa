import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../../assets/images/logo.jpeg';
import AboutUsContent from '../SheetContent/AboutUsContent';
import ServicesContent from '../SheetContent/ServicesContent';
import PriceListContent from '../SheetContent/PriceListContent';
import VouchersContent from '../SheetContent/VouchersContent';
import HowItWorksContent from '../SheetContent/HowItWorksContent';
import HowToBookContent from '../SheetContent/HowToBookContent';

const Navbar = ({ openSheet, howToBookButtonRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleMediaQueryChange = (e) => {
      setIsDesktop(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (e, title, contentComponent, sectionId) => {
    if (!isDesktop) { // On mobile
      e.preventDefault();
      openSheet(title, contentComponent);
    } else { // On desktop
      // Allow default anchor link behavior
      // The sectionId will be used by the href, no preventDefault needed
      if (sectionId) {
        // Optional: Smooth scroll for desktop if not natively handled by browser
        // document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
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
          <a href="#about-us-section" onClick={(e) => handleLinkClick(e, 'About Us', AboutUsContent, 'about-us-section')}>About Us</a>
          <a href="#services-section" onClick={(e) => handleLinkClick(e, 'Our Services', ServicesContent, 'services-section')}>Services</a>
          <a href="#price-list-section" onClick={(e) => handleLinkClick(e, 'Our Services & Pricing', PriceListContent, 'price-list-section')}>Price List</a>
          <a href="#vouchers-section" onClick={(e) => handleLinkClick(e, 'Gift or Redeem a Voucher', VouchersContent, 'vouchers-section')}>Vouchers</a>
          <a href="#how-to-book-section" onClick={(e) => handleLinkClick(e, 'How To Book', HowToBookContent, 'how-to-book-section')} ref={howToBookButtonRef}>How to book</a>
          <a href="#how-it-works-section" onClick={(e) => handleLinkClick(e, 'How It Works', HowItWorksContent, 'how-it-works-section')}>How It Works</a>
        </div>
      </div>
      <div className="navbar-right">
        <a href="#how-to-book-section" className="button button-primary" onClick={(e) => handleLinkClick(e, 'How To Book', HowToBookContent, 'how-to-book-section')}>Book Now</a>
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
