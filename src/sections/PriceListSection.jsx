import React, { useState, useEffect } from 'react';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import './PriceListSection.css';

const services = [
  {
    category: 'Massage Therapy',
    items: [
      { id: 'full-body-massage', name: 'Full Body Massage', duration: '60/90 min', price: 'R800/ 1000' },
      { id: 'couples-massage', name: 'Couples Massage', duration: '60/90 min', price: 'R1700/ 2100' },
      { id: 'lymph-drainage', name: 'Lymph Drainage', duration: '75/90 min', price: 'R850/ 1000' },
      { id: 'pregnancy-massage', name: 'Pregnancy Massage', duration: '60/90 min', price: 'R850/ 1000' },
      { id: 'wood-therapy-massage', name: 'Wood Therapy Massage', duration: '75/90 min', price: 'R1050/ 1350' },
    ],
  },
  {
    category: 'Skincare & Spa Beauty',
    items: [
      { id: 'express-facial', name: 'Express Facial', duration: '30 min', price: 'R550' },
      { id: 'hydrating-facial', name: 'Hydrating Facial', duration: '60 min', price: 'R800' },
      // Note: Brow shape & Tint has no duration specified, using an empty string.
      { id: 'brow-shape-tint', name: 'Brow Shape & Tint', duration: '', price: 'R200' },
      { id: 'tint-lash-brow', name: 'Tint Lash & Brow', duration: '20 min', price: 'R220' },
      { id: 'tint-lashes', name: 'Tint Lashes', duration: '20 min', price: 'R150' },
      { id: 'tint-brows', name: 'Tint Brows', duration: '15 min', price: 'R100' },
    ],
  },
  {
    category: 'Hand & Foot Care',
    // Note for Hand & Foot Care: Added description to the category name for clarity, 
    // but the table structure doesn't support an inline note.
    items: [
      // Manicure/Pedicure prices are separated by a slash (R400/R450)
      { id: 'express-mani-pedi', name: 'Express Mani or Pedi', duration: '', price: 'R400/R450' },
      { id: 'delux-spa-mani-pedi', name: 'Delux Spa Mani or Pedi', duration: '', price: 'R600/R650' },
    ],
  },
  {
    category: 'Waxing',
    items: [
      { id: 'lip-chin-brow-wax', name: 'Lip/ Chin/ Brow', duration: '15 min', price: 'R120' },
      { id: 'underarm-sides-wax', name: 'Underarm/ Sides of Face', duration: '20 min', price: 'R150' },
      { id: 'full-face-wax', name: 'Full Face', duration: '20 min', price: 'R300' },
      { id: 'bikini-half-arm-wax', name: 'Bikini Line/ Half Arm', duration: '25 min', price: 'R250' },
      { id: 'brazilian-wax', name: 'Brazilian', duration: '30 min', price: 'R400' },
      { id: 'hollywood-wax', name: 'Hollywood', duration: '30 min', price: 'R500' },
      { id: 'half-leg-full-arm-half-chest', name: 'Half Leg/ Full Arm/ Half Chest', duration: '30 min', price: 'R300' },
      { id: 'full-leg-wax', name: 'Full Leg', duration: '45 min', price: 'R400' },
      { id: 'back-chest-wax', name: 'Back/ Chest', duration: '45 min', price: 'R480' },
    ],
  },
  {
    category: 'Spa Packages',
    items: [
      { id: 'recharge-me-package', name: 'Recharge Me (Pick any 3)', duration: '90 min', price: 'R1400' },
      { id: 'polish-me-package', name: 'Polish Me', duration: '2 hr 30 min', price: 'R1850' },
      { id: 'mommy-to-be-package', name: 'Mommy to Be', duration: '90 min', price: 'R1300' },
    ],
  },
  {
    category: 'Enhancements',
    items: [
      { id: 'back-massage-enhancement', name: 'Back Massage', duration: '30/45 min', price: 'R500/ 600' },
      { id: 'foot-massage-enhancement', name: 'Foot Massage', duration: '30 min', price: 'R500' },
      { id: 'head-massage-enhancement', name: 'Head Massage', duration: '30 min', price: 'R500' },
      { id: 'full-body-scrub-enhancement', name: 'FullBody Scrub', duration: '30 min', price: 'R450' },
      { id: 'back-scrub-enhancement', name: 'Back Scrub', duration: '15 min', price: 'R300' },
      { id: 'woodtherapy-enhancement', name: 'Woodtherapy  (Tummy/Thighs)', duration: '', price: 'R500' },
    ],
  },
];

const PriceListSection = ({ onAddService }) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [animatedButtons, setAnimatedButtons] = useState({});

  const handleAddServiceClick = (item) => {
    onAddService(item);
    setAnimatedButtons((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAnimatedButtons((prev) => ({ ...prev, [item.id]: false }));
    }, 500); // Animation duration
  };

  const selectedCategory = services[selectedCategoryIndex];

  return (
    <section className="price-list-section" id="price-list-section">
      <FadeInOnScroll>
        <h2 className="section-title">Our Services & Pricing</h2>
        <p className="section-subtitle">
          Your wellness mobile spa provides an array of finest wellness treatments, each with a specific goal, such as relaxation, invigoration or reducing stress. Kids treatments available on request.
        </p>
        <div className="pricelist-button-container">
          <a href="/brochure.pdf" className="button" download>View and Download Pricelist</a>
        </div>
        <div className="mini-nav">
          {services.map((category, index) => (
            <button
              key={index}
              className={`mini-nav-button ${selectedCategoryIndex === index ? 'active' : ''}`}
              onClick={() => setSelectedCategoryIndex(index)}
            >
              {category.category}
            </button>
          ))}
        </div>
        <div className="price-list-content">
          <div className="price-category">
            <h3 id={selectedCategory.category.toLowerCase().replace(/\s/g, '-')}>{selectedCategory.category}</h3>
            <table className="price-table">
              <thead>
                <tr><th>Service</th><th>Duration</th><th>Price</th><th>{''}</th></tr>
              </thead>
              <tbody>
                {selectedCategory.items.map((item, itemIndex) => (
                  <tr key={itemIndex} id={item.id}><td>{item.name}</td><td>{item.duration}</td><td>{item.price}</td><td><button className={`add-service-button ${animatedButtons[item.id] ? 'animate' : ''}`} onClick={() => handleAddServiceClick(item)}>+</button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
};

export default PriceListSection;
