import React from 'react';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import './HowToBook.css';
import HowItWorksContent from '../components/SheetContent/HowItWorksContent';

const HowToBook = () => {
  return (
    <section className="how-to-book-section" id="how-it-works">
      <FadeInOnScroll>
        <h2 className="section-title">How It Works</h2>
        <HowItWorksContent />
      </FadeInOnScroll>
    </section>
  );
};

export default HowToBook;
