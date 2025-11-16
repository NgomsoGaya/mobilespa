import React from 'react';
import './Button.css';

const Button = ({ children, type = 'primary', size = 'normal', onClick, href }) => {
  const sizeClass = size === 'large' ? 'button-large' : '';
  const commonProps = {
    className: `button ${type} ${sizeClass}`,
    onClick: onClick,
  };

  if (href) {
    return (
      <a href={href} {...commonProps}>
        {children}
      </a>
    );
  }

  return (
    <button {...commonProps}>
      {children}
    </button>
  );
};

export default Button;
