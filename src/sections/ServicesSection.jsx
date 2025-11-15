import React from 'react';
import ServiceCard from './ServiceCard';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import './ServicesSection.css';
import massageTherapy from '../assets/images/massagetherapy.jpg';
import facial from '../assets/images/facial.jpg';
import couplesTherapy from '../assets/images/couplestherapy.jpg';
import aromatherapy from '../assets/images/aromatherapy.jpg';

const services = [
  {
    icon: massageTherapy,
    title: 'Massage Therapy',
    description: 'Swedish, Deep Tissue, or Hot Stone to release tension.',
    price: 'R120',
  },
  {
    icon: facial,
    title: 'Skincare Therapy',
    description: 'Organic facials with gentle expert care.',
    price: 'R95',
  },
  {
    icon: couplesTherapy,
    title: 'Hand & Foot Care',
    description: 'Side-by-side relaxation treatments.',
    price: 'R220',
  },
  {
    icon: aromatherapy,
    title: 'Waxing & Tinting',
    description: 'Mind–body balance with essential oils.',
    price: 'R85',
  },
  {
    icon: aromatherapy,
    title: 'Corporate Wellness',
    description: 'Mind–body balance with essential oils.',
    price: 'R85',
  },
  {
    icon: aromatherapy,
    title: 'Special Occasions & Pamper Parties',
    description: 'Mind–body balance with essential oils.',
    price: 'R85',
  },
];


const ServicesSection = () => {
  return (
    <section className="services-section" id="services">
      <FadeInOnScroll>
        <h2 className="section-title">Treatments for Your Well-Being</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              price={service.price}
            />
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
};

export default ServicesSection;
