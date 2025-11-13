import React from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import AdvantageSection from './sections/AdvantageSection';
import WhyChooseUsSection from './sections/WhyChooseUsSection';
import CTASection from './sections/CTASection';
import './App.css'; // Assuming some global app styling if needed

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <AdvantageSection />
        <WhyChooseUsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
