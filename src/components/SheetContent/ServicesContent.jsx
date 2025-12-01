import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import ServiceCard from '../../sections/ServiceCard';
import './ServicesContent.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import massageTherapy from '../../assets/images/massagetherapy.jpg';
import facial from '../../assets/images/facial.jpg';
import couplesTherapy from '../../assets/images/couplestherapy.jpg';
import aromatherapy from '../../assets/images/aromatherapy.jpg';

const services = [
  {
    id: 'massage-therapy', // Matching ID from PriceListSection
    icon: massageTherapy,
    title: 'Massage Therapy',
    description: 'Swedish, Deep Tissue, or Hot Stone to release tension.',
    price: 'R120',
  },
  {
    id: 'skincare-therapy', // Matching ID from PriceListSection
    icon: facial,
    title: 'Skincare Therapy',
    description: 'Organic facials with gentle expert care.',
    price: 'R95',
  },
  {
    id: 'hand-foot-care', // Matching ID from PriceListSection
    icon: couplesTherapy,
    title: 'Hand & Foot Care',
    description: 'Side-by-side relaxation treatments.',
    price: 'R220',
  },
  {
    id: 'waxing-tinting', // Matching ID from PriceListSection
    icon: aromatherapy,
    title: 'Waxing & Tinting',
    description: 'Mind–body balance with essential oils.',
    price: 'R85',
  },
  {
    id: 'corporate-wellness', // New ID for this service
    icon: aromatherapy,
    title: 'Corporate Wellness',
    description: 'Mind–body balance with essential oils.',
    price: 'R85',
  },
  {
    id: 'special-occasions-pamper-parties', // New ID for this service
    icon: aromatherapy,
    title: 'Special Occasions & Pamper Parties',
    description: 'Mind–body balance with essential oils.',
    price: 'R85',
  },
];

const ServicesContent = () => {
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
    <div className="services-content">
      {isMobile ? (
        <Slider {...settings}>
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              price={service.price}
              serviceId={service.id} // Pass service.id directly
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
              serviceId={service.id} // Pass service.id directly
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesContent;
