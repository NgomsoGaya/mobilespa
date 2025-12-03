import React, { useState } from 'react';
import DaySelector from './DaySelector';
import TimeSelector from './TimeSelector';
import Button from '../../UI/Button';
import './BookingSelector.css';

const BookingSelector = ({ onContinue, selectedServices, onRemoveService, onResetBooking }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedTime(null); // Reset time if day changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContinueClick = () => {
    if (selectedDay && selectedTime) {
      // Assuming a default location since location selection is removed
      const selectedLocation = { id: 'mobile', name: 'Mobile Service (Your Home)' };
      onContinue({ selectedLocation, selectedDay, selectedTime });
    } else {
      alert('Please select a day and time.');
    }
  };

  const getAvailableDays = () => {
    // In a real app, this would fetch available days from a backend
    const today = new Date();
    const available = [];
    for (let i = 0; i < 30; i++) { // Changed to 30 days
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      available.push(date);
    }
    return available;
  };

  const getAvailableTimes = (day) => {
    // In a real app, this would fetch available times from a backend based on day
    if (!day) return [];
    const times = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM', '5:00 PM'];
    return times;
  };

  const availableDays = getAvailableDays();
  const availableTimes = getAvailableTimes(selectedDay);

  return (
    <div className="booking-selector card">
      <h3>Selected Services:</h3>
      <ul className="selected-services-list">
        {selectedServices.map(service => (
          <li key={service.id}>
            {service.name} - {service.price}
            <button
              className="remove-service-button" // Reuse existing styling
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
      {selectedDay && (
        <TimeSelector
          availableTimes={availableTimes}
          selectedTime={selectedTime}
          onSelectTime={handleTimeSelect}
        />
      )}
      <Button
        type="primary"
        size="large"
        onClick={handleContinueClick}
        disabled={!selectedDay || !selectedTime}
      >
        Book via Whatsapp
      </Button>
    </div>
  );
};

export default BookingSelector;
