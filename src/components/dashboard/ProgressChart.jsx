import React from 'react';
import './ProgressChart.css';

const ProgressChart = ({ xp, nextLevelXp }) => {
  const progress = (xp / nextLevelXp) * 100;
  
  return (
    <div className="progress-chart">
      <div className="progress-header flex-between">
        <span className="progress-label">Level Progress</span>
        <span className="progress-percentage">{Math.round(progress)}%</span>
      </div>
      
      <div className="progress-bar-large">
        <div 
          className="progress-fill-large" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="progress-numbers flex-between">
        <span>{xp} XP</span>
        <span>{nextLevelXp} XP</span>
      </div>
    </div>
  );
};

export default ProgressChart;