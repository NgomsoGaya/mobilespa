import React, { useState } from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import HowToBook from './sections/HowToBook';
import AdvantageSection from './sections/AdvantageSection';
import AboutUsSection from './sections/AboutUsSection';
import PriceListSection from './sections/PriceListSection';
import VouchersSection from './sections/VouchersSection';
import CTASection from './sections/CTASection';
import './App.css';

function App() {
  const [selectedServices, setSelectedServices] = useState([]);

  const handleAddService = (service) => {
    setSelectedServices((prevServices) => {
      // Prevent adding duplicate services
      if (prevServices.find(s => s.id === service.id)) {
        return prevServices;
      }
      return [...prevServices, service];
    });
  };

  return (
    <div className="App">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <CTASection selectedServices={selectedServices} /> {/* Pass selectedServices */}
        <PriceListSection onAddService={handleAddService} /> {/* Pass onAddService */}
        <HowToBook />
        <VouchersSection />
        <AboutUsSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
