import React from 'react';


const ProgressChart = ({ xp, nextLevelXp }) => {
  const progress = (xp / nextLevelXp) * 100;
  
  return (
    <div className="w-full">
      <div className="mb-3 flex justify-between items-center">
        <span className="font-medium">Level Progress</span>
        <span className="text-accent font-semibold">{Math.round(progress)}%</span>
      </div>
      
      <div className="h-3 bg-surface rounded-md overflow-hidden mb-2">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent rounded-md transition-all duration-700 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="text-xs text-text-secondary flex justify-between items-center">
        <span>{xp} XP</span>
        <span>{nextLevelXp} XP</span>
      </div>
    </div>
  );
};

export default ProgressChart;