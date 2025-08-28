import React from 'react';

const StatsCard = ({ title, value, icon, color, delay = 0 }) => {
  return (
    <div 
      className="card p-6 shadow-lg transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg bg-gradient-to-br from-primary-light/80 to-primary"
          style={{ background: color ? `linear-gradient(135deg, ${color}CC, ${color})` : undefined }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm text-gray-300 mb-1">{title}</h3>
          <p className="text-3xl font-bold heading-gradient">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;