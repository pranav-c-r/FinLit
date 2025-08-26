import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="stats-card card">
      <div className="stats-content">
        <div className="stats-icon" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className="stats-info">
          <h3 className="stats-title">{title}</h3>
          <p className="stats-value">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;