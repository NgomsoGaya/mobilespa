import React from 'react';
import './AboutUsContent.css';

const AboutUsContent = () => {
  return (
    <div className="about-us-content"> {/* Updated class name */}
      <div className="about-us-text"> {/* Updated class name */}
        <p>
          Welcome to Wellness Mobile Spa, where wellness meets convenience. We are dedicated to bringing
          the ultimate spa experience directly to your home, office, or event. Our team of highly
          skilled and certified therapists are passionate about providing personalized treatments
          that nourish your mind, body, and soul.
        </p>
        <p>
          Founded on the principle that wellness should be accessible to everyone, we meticulously
          curate each session to ensure a wellness-focused and luxurious escape from the everyday hustle.
          From soothing massages to revitalizing facials, every service is delivered with the
          highest standards of professionalism and care, using only premium, organic products.
        </p>
        <p>
          Experience the difference of bespoke wellness, tailored to your schedule and preferences.
          Let us transform your space into a sanctuary of wellness and relaxation.
        </p>
      </div>
    </div>
  );
};

export default AboutUsContent;
