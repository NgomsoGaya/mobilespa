import React, { useState } from 'react';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import IconCircle from '../components/UI/IconCircle'; // Assuming this component exists for icons
import Button from '../components/UI/Button'; // Assuming this component exists for navigation
import './HowToBook.css';
import book from '../assets/images/book.png';
import arrive from '../assets/images/arrive.png';
import massage from '../assets/images/massage.png';

// Placeholder data for the steps
const howItWorksSteps = [
  {
    id: 1,
    icon: book,
    title: 'Book Online',
    description: 'Choose your preferred service, date, and time through our easy online booking system.',
  },
  {
    id: 2,
    icon: arrive,
    title: 'We Arrive',
    description: 'Our certified therapist arrives at your location with all the necessary equipment.',
  },
  {
    id: 3,
    icon: massage,
    title: 'Relax & Enjoy',
    description: 'Indulge in a personalized spa experience in the comfort of your own space.',
  },
];

const HowToBook = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prevStep) => (prevStep + 1) % howItWorksSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => (prevStep - 1 + howItWorksSteps.length) % howItWorksSteps.length);
  };

  return (
    <section className="how-to-book-section" id="how-it-works">
      <FadeInOnScroll>
        <h2 className="section-title">How It Works</h2>
        <div className="how-to-book-desktop">
          {howItWorksSteps.map((step) => (
            <div className="how-to-book-card card" key={step.id}>
              <IconCircle icon={step.icon} alt={step.title} />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        <div className="how-to-book-mobile">
          <div className="how-to-book-card card">
            <IconCircle icon={howItWorksSteps[currentStep].icon} alt={howItWorksSteps[currentStep].title} />
            <h3>{howItWorksSteps[currentStep].title}</h3>
            <p>{howItWorksSteps[currentStep].description}</p>
          </div>
          <div className="how-to-book-navigation">
            <Button onClick={prevStep}>Previous</Button>
            <Button onClick={nextStep}>Next</Button>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
};

export default HowToBook;