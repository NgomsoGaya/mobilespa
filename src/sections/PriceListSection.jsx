import React from 'react';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import './PriceListSection.css';

const services = [
  {
    category: 'Massage Therapy',
    items: [
      { name: 'Swedish Massage', duration: '60 min', price: 'R120' },
      { name: 'Deep Tissue Massage', duration: '60 min', price: 'R150' },
      { name: 'Hot Stone Massage', duration: '75 min', price: 'R200' },
      { name: 'Aromatherapy Massage', duration: '60 min', price: 'R140' },
    ],
  },
  {
    category: 'Skincare Therapy',
    items: [
      { name: 'Organic Facial', duration: '60 min', price: 'R95' },
      { name: 'Hydrating Facial', duration: '60 min', price: 'R110' },
      { name: 'Anti-Aging Facial', duration: '75 min', price: 'R130' },
    ],
  },
  {
    category: 'Hand & Foot Care',
    items: [
      { name: 'Classic Manicure', duration: '45 min', price: 'R80' },
      { name: 'Spa Pedicure', duration: '60 min', price: 'R120' },
      { name: 'Gel Manicure', duration: '60 min', price: 'R150' },
    ],
  },
  {
    category: 'Waxing & Tinting',
    items: [
      { name: 'Eyebrow Wax', duration: '15 min', price: 'R40' },
      { name: 'Full Leg Wax', duration: '45 min', price: 'R180' },
      { name: 'Bikini Wax', duration: '30 min', price: 'R100' },
      { name: 'Eyelash Tint', duration: '20 min', price: 'R60' },
    ],
  },
];

const PriceListSection = () => {
  return (
    <section className="price-list-section" id="price-list-section">
      <FadeInOnScroll>
        <h2 className="section-title">Our Services & Pricing</h2>
        <p className="section-subtitle">
          Find the perfect treatment to rejuvenate your mind, body, and soul.
        </p>
        <div className="price-list-content">
          {services.map((serviceCategory, index) => (
            <div key={index} className="price-category">
              <h3>{serviceCategory.category}</h3>
              <table className="price-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Duration</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceCategory.items.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                      <td>{item.name}</td>
                      <td>{item.duration}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
};

export default PriceListSection;
