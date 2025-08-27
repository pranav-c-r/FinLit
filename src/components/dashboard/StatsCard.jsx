import React from 'react';

const StatsCard = ({ title, value, icon, color, delay = 0 }) => {
  return (
    <div 
      className="bg-[#0A1F14] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm text-[#80A1C1] mb-1">{title}</h3>
          <p className="text-3xl font-bold text-[#F4E87C]">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;