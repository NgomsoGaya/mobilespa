import React, { useState } from 'react';
import LocationSelector from './LocationSelector';
import DaySelector from './DaySelector';
import TimeSelector from './TimeSelector';
import Button from '../../UI/Button';
import './BookingSelector.css';

const BookingSelector = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSelectedDay(null); // Reset day and time if location changes
    setSelectedTime(null);
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedTime(null); // Reset time if day changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookNow = () => {
    if (selectedLocation && selectedDay && selectedTime) {
      alert(`Booking confirmed for ${selectedLocation} on ${selectedDay.toDateString()} at ${selectedTime}`);
      // In a real application, you would send this data to a backend
    } else {
      alert('Please select a location, day, and time.');
    }
  };

  // Dummy data for demonstration
  const locations = [
    { id: 'mobile', name: 'Mobile Service (Your Home)' },
    { id: 'studio', name: 'Main Studio' },
  ];

  const getAvailableDays = (locationId) => {
    // In a real app, this would fetch available days from a backend based on location
    if (!locationId) return [];
    const today = new Date();
    const available = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      available.push(date);
    }
    return available;
  };

  const getAvailableTimes = (locationId, day) => {
    // In a real app, this would fetch available times from a backend based on location and day
    if (!locationId || !day) return [];
    const times = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM', '5:00 PM'];
    return times;
  };

  const availableDays = getAvailableDays(selectedLocation?.id);
  const availableTimes = getAvailableTimes(selectedLocation?.id, selectedDay);

  return (
    <div className="booking-selector card">
      <h3>Select Your Booking Details</h3>
      <LocationSelector
        locations={locations}
        selectedLocation={selectedLocation}
        onSelectLocation={handleLocationSelect}
      />
      {selectedLocation && (
        <DaySelector
          availableDays={availableDays}
          selectedDay={selectedDay}
          onSelectDay={handleDaySelect}
        />
      )}
      {selectedLocation && selectedDay && (
        <TimeSelector
          availableTimes={availableTimes}
          selectedTime={selectedTime}
          onSelectTime={handleTimeSelect}
        />
      )}
      <Button
        type="primary"
        size="large"
        onClick={handleBookNow}
        disabled={!selectedLocation || !selectedDay || !selectedTime}
      >
        Book Now
      </Button>
    </div>
  );
};

export default BookingSelector;
