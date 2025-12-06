import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import ServiceCard from '../../sections/ServiceCard'; // Assuming ServiceCard still lives in sections
import ServiceModal from '../ServiceModal'; // NEW IMPORT
import './ServicesContent.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import servicesData from '../../data/servicesData'; // NEW IMPORT - path relative to ServicesContent

const ServicesContent = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

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

  const handleLearnMoreClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
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
    <div className="services-content">
      {isMobile ? (
        <Slider {...settings}>
          {servicesData.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              shortDescription={service.shortDescription}
              onLearnMoreClick={() => handleLearnMoreClick(service)}
            />
          ))}
        </Slider>
      ) : (
        <div className="services-grid">
          {servicesData.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              shortDescription={service.shortDescription}
              onLearnMoreClick={() => handleLearnMoreClick(service)}
            />
          ))}
        </div>
      )}

      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
    </div>
  );
};

export default ServicesContent;