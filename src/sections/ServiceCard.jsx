import React from 'react';
import Button from '../components/UI/Button';
import './ServiceCard.css';

const ServiceCard = ({ icon, title, description, price, serviceId }) => {
  return (
    <div className="service-card card">
      <img src={icon} alt={title} className="service-icon" />
      <h3 className="service-title">{title}</h3>
      {/* <p className="service-description">{description}</p> */}
      {/* <div className="service-price">Starting From: {price}</div> */}
      <br />
      <Button type="primary" href='#price-list-section'>Learn More</Button>
    </div>
  );
};

export default ServiceCard;
