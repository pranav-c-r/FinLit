import React from 'react';

const ProgressChart = ({ xp, nextLevelXp }) => {
  const progress = (xp / nextLevelXp) * 100;
  
  return (
    <div className="w-full">
      <div className="mb-3 flex justify-between items-center">
        <span className="font-medium text-[#80A1C1]">Level Progress</span>
        <span className="text-[#F4E87C] font-semibold">{Math.round(progress)}%</span>
      </div>
      
      <div className="h-4 bg-[#0C291C] rounded-full overflow-hidden mb-2 shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-[#80A1C1] to-[#F4E87C] rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="text-xs text-[#80A1C1] flex justify-between items-center">
        <span>{xp} XP</span>
        <span>{nextLevelXp} XP</span>
      </div>
    </div>
  );
};

export default ProgressChart;