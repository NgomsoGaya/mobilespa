import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import ServiceCard from './ServiceCard';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import ServiceModal from '../components/ServiceModal'; // NEW IMPORT
import './ServicesSection.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import servicesData from '../data/servicesData'; // NEW IMPORT

const ServicesSection = () => {
  const [isMobile, setIsMobile] = useState(false); // Keep for Slider conditional
  const [isModalOpen, setIsModalOpen] = useState(false); // NEW STATE for modal
  const [selectedService, setSelectedService] = useState(null); // NEW STATE for modal

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

  const handleLearnMoreClick = (service) => { // NEW HANDLER
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { // NEW HANDLER
    setIsModalOpen(false);
    setSelectedService(null);
  };

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
    <section className="services-section" id="services-section">
      <FadeInOnScroll>
        <h2 className="section-title">Our Services</h2>
        {isMobile ? (
          <Slider {...settings}>
            {servicesData.map((service) => ( // Use servicesData
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                shortDescription={service.shortDescription} // Use shortDescription
                onLearnMoreClick={() => handleLearnMoreClick(service)} // NEW PROP
              />
            ))}
          </Slider>
        ) : (
          <div className="services-grid">
            {servicesData.map((service) => ( // Use servicesData
              <ServiceCard
                key={service.id}
                icon={service.icon}
                title={service.title}
                shortDescription={service.shortDescription} // Use shortDescription
                onLearnMoreClick={() => handleLearnMoreClick(service)} // NEW PROP
              />
            ))}
          </div>
        )}
      </FadeInOnScroll>

      {/* Render ServiceModal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
    </section>
  );
};

export default ServicesSection;
