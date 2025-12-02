import React from 'react';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import './HowItWorksSection.css';
import HowItWorksContent from '../components/SheetContent/HowItWorksContent';

const HowItWorksSection = () => {
  return (
    <section className="how-it-works-section" id="how-it-works-section">
      <FadeInOnScroll>
        <h2 className="section-title">How It Works</h2>
        <HowItWorksContent />
      </FadeInOnScroll>
    </section>
  );
};

export default HowItWorksSection;