import React from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import HowToBook from './sections/HowToBook'; // New import
import AdvantageSection from './sections/AdvantageSection';
import AboutUsSection from './sections/AboutUsSection';
import PriceListSection from './sections/PriceListSection';
import VouchersSection from './sections/VouchersSection';
import CTASection from './sections/CTASection';
import './App.css'; // Assuming some global app styling if needed

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <CTASection />
        <PriceListSection />
        <HowToBook />
        <VouchersSection />
        <AboutUsSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
