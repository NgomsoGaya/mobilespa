import React, { useState } from 'react';
import BookingSelector from '../Forms/Booking/BookingSelector';
import BookingModal from '../Forms/Booking/BookingModal';
import Button from '../UI/Button';
import './HowToBookContent.css';

const HowToBookContent = ({ selectedServices }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleContinueBooking = (details) => {
    setBookingDetails({ ...details, selectedServices });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBookingDetails(null);
  };

  return (
    <div className="how-to-book-content-wrapper">
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

      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          bookingDetails={bookingDetails}
        />
      )}
    </div>
  );
};

export default HowToBookContent;