import React from 'react';
import './IconCircle.css';

const IconCircle = ({ icon }) => {
  return (
    <div className="icon-circle">
      <img src={icon} alt="" />
    </div>
  );
};

export default IconCircle;
