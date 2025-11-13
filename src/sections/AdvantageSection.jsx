import React from 'react';
import IconCircle from '../components/UI/IconCircle';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import './AdvantageSection.css';
import book from '../assets/images/book.png';
import arrive from '../assets/images/arrive.png';
import massage from '../assets/images/massage.png';

const steps = [
  {
    icon: book,
    title: 'Select & Book',
    description: 'Choose your treatment and location online.',
  },
  {
    icon: arrive,
    title: 'We Arrive',
    description: 'Certified therapist arrives with full setup.',
  },
  {
    icon: massage,
    title: 'Relax & Renew',
    description: 'Enjoy luxury spa therapy at home.',
  },
];

const AdvantageSection = () => {
  return (
    <section className="advantage-section" id="how-it-works">
      <FadeInOnScroll>
        <h2 className="section-title">The Mobile Advantage</h2>
        <div className="advantage-grid">
          {steps.map((step, index) => (
            <div className="advantage-step card" key={index}>
              <IconCircle icon={step.icon} />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
};

export default AdvantageSection;
