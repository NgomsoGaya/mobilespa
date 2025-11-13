import React from 'react';
import './StatCard.css';

const StatCard = ({ value, label }) => {
  return (
    <div className="stat-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export default StatCard;
