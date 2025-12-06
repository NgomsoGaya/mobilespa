import React from 'react';
import Button from '../components/UI/Button';
import './ServiceCard.css';

const ServiceCard = ({ icon, title, shortDescription, onLearnMoreClick }) => { // Updated props
  return (
    <div className="service-card card">
      <img src={icon} alt={title} className="service-icon" />
      <h3 className="service-title">{title}</h3>
      {/* <p className="service-description">{shortDescription}</p> Use shortDescription */}
      <br />
      <Button type="primary" onClick={onLearnMoreClick}>Learn More</Button> {/* Updated onClick and removed href */}
    </div>
  );
};

export default ServiceCard;