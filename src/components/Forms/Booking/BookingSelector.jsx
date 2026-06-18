import React, { useState } from 'react';
import DaySelector from './DaySelector';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';
import './BookingSelector.css';

const BookingSelector = ({ onContinue, selectedServices, onRemoveService, onResetBooking }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const handleContinueClick = () => {
    if (selectedDay) {
      const selectedLocation = { id: 'mobile', name: 'Mobile Service (Your Home)' };
      onContinue({ selectedLocation, selectedDay, selectedTime: 'No specific time chosen' });
    } else {
      setModal({
        isOpen: true,
        title: 'Selection Required',
        message: 'Please select a day for your booking.',
        type: 'error'
      });
    }
  };

  const availableDays = getAvailableDays();

  return (
    <div className="booking-selector card">
      <Modal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        type={modal.type}
      >
        <p>{modal.message}</p>
      </Modal>
      
      <h3>Selected Services:</h3>
      <ul className="selected-services-list">
        {selectedServices.map(service => (
          <li key={service.id}>
            {service.name} - {service.price}
            <button
              className="remove-service-button"
              onClick={() => onRemoveService(service.id)}
            >
              -
            </button>
          </li>
        ))}
      </ul>
      
      <h3>Select Your Booking Details</h3>
      <DaySelector
        availableDays={availableDays}
        selectedDay={selectedDay}
        onSelectDay={handleDaySelect}
      />
      
      <Button
        type="primary"
        size="large"
        onClick={handleContinueClick}
        disabled={!selectedDay}
      >
        Book via Whatsapp
      </Button>
    </div>
  );
};

const getAvailableDays = () => {
  const today = new Date();
  const available = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    available.push(date);
  }
  return available;
};

export default BookingSelector;
