import React, { useState, useEffect } from 'react';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import './PriceListSection.css';

const services = [
  {
    category: 'Massage Therapy',
    items: [
      { id: 'swedish-massage', name: 'Swedish Massage', duration: '60 min', price: 'R120' },
      { id: 'deep-tissue-massage', name: 'Deep Tissue Massage', duration: '60 min', price: 'R150' },
      { id: 'hot-stone-massage', name: 'Hot Stone Massage', duration: '75 min', price: 'R200' },
      { id: 'aromatherapy-massage', name: 'Aromatherapy Massage', duration: '60 min', price: 'R140' },
    ],
  },
  {
    category: 'Skincare Therapy',
    items: [
      { id: 'organic-facial', name: 'Organic Facial', duration: '60 min', price: 'R95' },
      { id: 'hydrating-facial', name: 'Hydrating Facial', duration: '60 min', price: 'R110' },
      { id: 'anti-aging-facial', name: 'Anti-Aging Facial', duration: '75 min', price: 'R130' },
    ],
  },
  {
    category: 'hand-foot-care',
    items: [
      { id: 'classic-manicure', name: 'Classic Manicure', duration: '45 min', price: 'R80' },
      { id: 'spa-pedicure', name: 'Spa Pedicure', duration: '60 min', price: 'R120' },
      { id: 'gel-manicure', name: 'Gel Manicure', duration: '60 min', price: 'R150' },
    ],
  },
  {
    category: 'waxing-tinting',
    items: [
      { id: 'eyebrow-wax', name: 'Eyebrow Wax', duration: '15 min', price: 'R40' },
      { id: 'full-leg-wax', name: 'Full Leg Wax', duration: '45 min', price: 'R180' },
      { id: 'bikini-wax', name: 'Bikini Wax', duration: '30 min', price: 'R100' },
      { id: 'eyelash-tint', name: 'Eyelash Tint', duration: '20 min', price: 'R60' },
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
        <a href="/YourWellnessMobileSpa-Brochure&PriceList.pdf" className="button" download>View and Download Pricelist</a>
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
