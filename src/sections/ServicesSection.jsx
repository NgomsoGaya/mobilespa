import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import ServiceCard from './ServiceCard';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import './ServicesSection.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <section className="services-section" id="services">
      <FadeInOnScroll>
        <h2 className="section-title">Our Servicees</h2>
        {isMobile ? (
          <Slider {...settings}>
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                price={service.price}
              />
            ))}
          </Slider>
        ) : (
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
        )}
      </FadeInOnScroll>
    </section>
  );
};

export default ServicesSection;
