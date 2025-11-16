import React, { useState } from 'react';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import BookingSelector from '../components/Forms/Booking/BookingSelector';
import BookingModal from '../components/Forms/Booking/BookingModal';
import './CTASection.css';

const CTASection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Dummy data for selected services - this would come from a service selection mechanism
  const [selectedServices, setSelectedServices] = useState([
    { id: 'massage', name: 'Massage Therapy', price: 'R120' },
    { id: 'facial', name: 'Skincare Therapy', price: 'R95' },
  ]);

  const handleContinueBooking = (details) => {
    setBookingDetails({ ...details, selectedServices }); // Pass selected services to modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBookingDetails(null);
  };

  return (
    <section className="cta-section" id="cta-section">
      <FadeInOnScroll>
        <h2 className="cta-title">How To Book?</h2>
        <BookingSelector onContinue={handleContinueBooking} selectedServices={selectedServices} />
      </FadeInOnScroll>

      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          bookingDetails={bookingDetails}
        />
      )}
    </section>
  );
};

export default CTASection;
