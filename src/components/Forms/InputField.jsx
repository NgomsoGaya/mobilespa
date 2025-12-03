import React from 'react';
import './InputField.css';

const InputField = ({ label, ...props }) => { // Destructure label, capture rest of props
  return (
    <div className="input-field">
      <label>{label}</label>
      <input {...props} /> {/* Spread props to the input element */}
    </div>
  );
};

export default InputField;
