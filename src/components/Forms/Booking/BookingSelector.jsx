import React, { useState } from 'react';
import DaySelector from './DaySelector';
// import TimeSelector from './TimeSelector'; // Removed
import Button from '../../UI/Button';
import './BookingSelector.css';

const BookingSelector = ({ onContinue, selectedServices, onRemoveService, onResetBooking }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  // const [selectedTime, setSelectedTime] = useState(null); // Removed

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    // setSelectedTime(null); // Removed
  };

  // const handleTimeSelect = (time) => { // Removed
  //   setSelectedTime(time);
  // };

  const handleContinueClick = () => {
    if (selectedDay) { // Modified: only check selectedDay
      // Assuming a default location since location selection is removed
      const selectedLocation = { id: 'mobile', name: 'Mobile Service (Your Home)' };
      // Pass a default or null for selectedTime, as it's no longer selected
      onContinue({ selectedLocation, selectedDay, selectedTime: 'No specific time chosen' }); // Modified
    } else {
      alert('Please select a day.'); // Modified
    }
  };

  // const getAvailableTimes = (day) => { // Removed
  //   // In a real app, this would fetch available times from a backend based on day
  //   if (!day) return [];
  //   const times = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM', '5:00 PM'];
  //   return times;
  // };

  const availableDays = getAvailableDays();
  // const availableTimes = getAvailableTimes(selectedDay); // Removed

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
      {/* Removed TimeSelector block */}
      <Button
        type="primary"
        size="large"
        onClick={handleContinueClick}
        disabled={!selectedDay} // Modified
      >
        Book via Whatsapp
      </Button>
    </div>
  );
};

// Moved getAvailableDays outside to avoid recreation on every render
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