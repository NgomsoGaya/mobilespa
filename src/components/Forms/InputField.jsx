import React from 'react';
import './InputField.css';

const InputField = ({ label, type, placeholder }) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input type={type} placeholder={placeholder} />
    </div>
  );
};

export default InputField;
