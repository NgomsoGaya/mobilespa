import React from 'react';
import TestimonialCard from '../components/UI/TestimonialCard';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import './WhyChooseUsSection.css';

const WhyChooseUsSection = () => {
  return (
    <section className="why-choose-us-section">
      <FadeInOnScroll>
        <h2 className="section-title">Why Choose Us</h2>
        <div className="why-choose-us-content">
          <div className="why-choose-us-text">
            <ul>
              <li>Fully Certified & Insured Therapists</li>
              <li>Five-Star Hygiene Standards</li>
              <li>Only Organic Products</li>
              <li>Flexible Scheduling, 7 Days a Week</li>
            </ul>
          </div>
          <div className="why-choose-us-testimonial">
            <TestimonialCard
              quote="An incredible experience — I never imagined such luxury could come to my home."
              author="Client Name"
              rating={5}
            />
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
};

export default WhyChooseUsSection;
