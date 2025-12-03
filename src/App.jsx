import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HeroSection from './sections/HeroSection';
import CTASection from './sections/CTASection';
import AboutUsSection from './sections/AboutUsSection';
import ServicesSection from './sections/ServicesSection';
import PriceListSection from './sections/PriceListSection';
import VouchersSection from './sections/VouchersSection';
import HowItWorksSection from './sections/HowItWorksSection';
import BottomSheet from './components/UI/BottomSheet/BottomSheet';
import AboutUsContent from './components/SheetContent/AboutUsContent';
import ServicesContent from './components/SheetContent/ServicesContent';
import PriceListContent from './components/SheetContent/PriceListContent';
import VouchersContent from './components/SheetContent/VouchersContent';
import HowItWorksContent from './components/SheetContent/HowItWorksContent';
import HowToBookContent from './components/SheetContent/HowToBookContent';
import './App.css';

function App() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [sheetContent, setSheetContent] = useState(null); // { title: string, component: React.Component }
  const triggerRef = useRef(null); // Ref for the element that opened the sheet

  const openSheet = (title, Component, selectedServicesProp = []) => {
    setSheetContent({ title, Component, selectedServices: selectedServicesProp });
  };
  const closeSheet = () => setSheetContent(null);

  useEffect(() => {
    if (sheetContent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [sheetContent]);

  const handleAddService = (service) => {
    setSelectedServices((prevServices) => {
      if (prevServices.find(s => s.id === service.id)) {
        return prevServices;
      }
      return [...prevServices, service];
    });
  };

  const handleRemoveService = (serviceId) => { // NEW FUNCTION
    setSelectedServices((prevServices) => prevServices.filter(service => service.id !== serviceId));
  };

  const handleResetBooking = () => { // NEW FUNCTION
    setSelectedServices([]); // Clear selected services
    closeSheet(); // Close the modal
  };

  return (
    <div className="App">
      <Navbar
        openSheet={openSheet}
        howToBookButtonRef={triggerRef}
      />
      <main>
        <HeroSection />
        <ServicesSection />
        <CTASection
          selectedServices={selectedServices}
          onBookNowClick={() => openSheet('How To Book', HowToBookContent, selectedServices)}
          onRemoveService={handleRemoveService}
          onResetBooking={handleResetBooking}
        />
        <PriceListSection onAddService={handleAddService} />
          <VouchersSection />
          <HowItWorksSection />
        <AboutUsSection />
      </main>
      <Footer />
      <BottomSheet
        isOpen={!!sheetContent}
        onClose={closeSheet}
        onResetBooking={handleResetBooking} // Pass down to BottomSheet
        title={sheetContent?.title}
        triggerRef={triggerRef}
      >
        {sheetContent?.Component && (
          <sheetContent.Component
            onAddService={handleAddService}
            onRemoveService={handleRemoveService}
            selectedServices={selectedServices} // <--- Pass the current state directly
            onResetBooking={handleResetBooking} // Pass down to sheet content
          />
        )}
      </BottomSheet>
    </div>
  );
}

export default App;
