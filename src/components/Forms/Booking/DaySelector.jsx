import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default react-calendar styles
import './DaySelector.css';

const DaySelector = ({ availableDays, selectedDay, onSelectDay }) => {
  const today = new Date();
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30); // 30 days from today

  // Filter out times from availableDays for comparison with selectedDay
  const availableDates = availableDays.map(date => new Date(date.getFullYear(), date.getMonth(), date.getDate()));

  const tileDisabled = ({ date, view }) => {
    // Disable tiles in month view only
    if (view === 'month') {
      // Check if date is in the availableDates array
      return !availableDates.some(availableDate =>
        availableDate.getFullYear() === date.getFullYear() &&
        availableDate.getMonth() === date.getMonth() &&
        availableDate.getDate() === date.getDate()
      );
    }
    return false;
  };

  return (
    <div className="day-selector">
      <h4>Choose Day</h4>
      <Calendar
        onChange={onSelectDay}
        value={selectedDay}
        minDate={today} // Cannot select past dates
        maxDate={maxDate} // Cannot select beyond 30 days
        tileDisabled={tileDisabled}
        className="react-calendar-custom" // Custom class for styling
      />
      {availableDays.length === 0 && (
        <p className="no-availability">No days available.</p>
      )}
    </div>
  );
};

export default DaySelector;
