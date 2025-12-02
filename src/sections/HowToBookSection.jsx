import React from 'react';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import './HowToBookSection.css';
import HowToBookContent from '../components/SheetContent/HowToBookContent';

const HowToBookSection = () => {
  return (
    <section className="how-to-book-section" id="how-to-book-section">
      <FadeInOnScroll>
        <h2 className="section-title">How To Book</h2>
        <HowToBookContent />
      </FadeInOnScroll>
    </section>
  );
};

export default HowToBookSection;
