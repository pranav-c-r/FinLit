import React from 'react';


const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="p-6 card">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm text-text-secondary mb-1">{title}</h3>
          <p className="text-3xl font-bold text-primary">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;