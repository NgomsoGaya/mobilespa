import React from 'react';
import './InputField.css';

const InputField = ({ label, ...props }) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      {props.type === 'textarea' ? (
        <textarea {...props} className="input-element" />
      ) : (
        <input {...props} className="input-element" />
      )}
    </div>
  );
};

export default InputField;
