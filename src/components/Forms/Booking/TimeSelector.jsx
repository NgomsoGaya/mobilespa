import React, { useState, useEffect } from 'react';
import './TimeSelector.css';

const TimeSelector = ({ selectedTime, onSelectTime }) => {
  const [hour, setHour] = useState(selectedTime ? parseInt(selectedTime.split(':')[0]) : 9);
  const [minute, setMinute] = useState(selectedTime ? parseInt(selectedTime.split(':')[1].split(' ')[0]) : 0);
  const [ampm, setAmpm] = useState(selectedTime ? selectedTime.split(' ')[1] : 'AM');

  useEffect(() => {
    const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const timeString = `${formattedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
    onSelectTime(timeString);
  }, [hour, minute, ampm, onSelectTime]);

  const handleHourChange = (e) => {
    setHour(parseInt(e.target.value));
  };

  const handleMinuteChange = (e) => {
    setMinute(parseInt(e.target.value));
  };

  const handleAmpmToggle = () => {
    setAmpm((prevAmpm) => (prevAmpm === 'AM' ? 'PM' : 'AM'));
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0-59

  return (
    <div className="time-selector">
      <h4>Choose Time</h4>
      <div className="time-picker">
        <select value={hour} onChange={handleHourChange} className="time-select">
          {hours.map((h) => (
            <option key={h} value={h}>
              {h.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
        <span>:</span>
        <select value={minute} onChange={handleMinuteChange} className="time-select">
          {minutes.map((m) => (
            <option key={m} value={m}>
              {m.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
        <button onClick={handleAmpmToggle} className="ampm-button">
          {ampm}
        </button>
      </div>
    </div>
  );
};

export default TimeSelector;
