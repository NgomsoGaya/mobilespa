import React from 'react';
import './DaySelector.css';

const DaySelector = ({ availableDays, selectedDay, onSelectDay }) => {
  return (
    <div className="day-selector">
      <h4>Choose Day</h4>
      <div className="day-options">
        {availableDays.length > 0 ? (
          availableDays.map((day) => {
            const dayString = day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const isSelected = selectedDay && selectedDay.toDateString() === day.toDateString();
            return (
              <button
                key={day.toISOString()}
                className={`day-option ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectDay(day)}
              >
                {dayString}
              </button>
            );
          })
        ) : (
          <p className="no-availability">No days available for this location.</p>
        )}
      </div>
    </div>
  );
};

export default DaySelector;
