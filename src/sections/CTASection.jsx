import React from 'react';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import BookingSelector from '../components/Forms/Booking/BookingSelector'; // Import the new BookingSelector
import './CTASection.css';

const CTASection = () => {
  return (
    <section className="cta-section" id="cta-section">
      <FadeInOnScroll>
        <h2 className="cta-title">Ready to Experience Ultimate Convenience?</h2>
        <BookingSelector /> {/* Use the new BookingSelector component */}
      </FadeInOnScroll>
    </section>
  );
};

export default CTASection;
