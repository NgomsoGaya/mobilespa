import React from 'react';
import './LocationSelector.css';

const LocationSelector = ({ locations, selectedLocation, onSelectLocation }) => {
  return (
    <div className="location-selector">
      <h4>Choose Location</h4>
      <div className="location-options">
        {locations.map((location) => (
          <button
            key={location.id}
            className={`location-option ${selectedLocation?.id === location.id ? 'selected' : ''}`}
            onClick={() => onSelectLocation(location)}
          >
            {location.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationSelector;
