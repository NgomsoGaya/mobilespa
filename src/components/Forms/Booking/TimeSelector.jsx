import React from 'react';
import './TimeSelector.css';

const TimeSelector = ({ availableTimes, selectedTime, onSelectTime }) => {
  return (
    <div className="time-selector">
      <h4>Choose Time</h4>
      <div className="time-options">
        {availableTimes.length > 0 ? (
          availableTimes.map((time) => (
            <button
              key={time}
              className={`time-option ${selectedTime === time ? 'selected' : ''}`}
              onClick={() => onSelectTime(time)}
            >
              {time}
            </button>
          ))
        ) : (
          <p className="no-availability">No times available for this day.</p>
        )}
      </div>
    </div>
  );
};

export default TimeSelector;
