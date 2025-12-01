import React, { useState } from 'react';
import FadeInOnScroll from '../components/Transitions/FadeInOnScroll';
import BookingSelector from '../components/Forms/Booking/BookingSelector';
import BookingModal from '../components/Forms/Booking/BookingModal';
import Button from '../components/UI/Button'; // Import Button component
import './CTASection.css';

const CTASection = ({ selectedServices }) => { // Receive selectedServices as prop
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

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
        {selectedServices && selectedServices.length > 0 ? (
          <BookingSelector onContinue={handleContinueBooking} selectedServices={selectedServices} />
        ) : (
          <div className="no-services-selected">
            <p>Please select services from our price list to proceed with booking.</p>
            <Button type="primary" onClick={() => window.location.href = '#price-list-section'}>
              View Price List
            </Button>
          </div>
        )}
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