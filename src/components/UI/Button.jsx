import React from 'react';
import './Button.css';

const Button = ({ children, type = 'primary', size = 'normal', onClick }) => {
  const sizeClass = size === 'large' ? 'button-large' : '';
  return (
    <button className={`button button-${type} ${sizeClass}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
