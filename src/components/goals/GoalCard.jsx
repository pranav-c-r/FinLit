import React from 'react';

const GoalCard = ({ goal }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  
  return (
    <div className="bg-[#0A1F14] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg text-[#F4E87C] font-semibold">{goal.title}</h3>
        <span className="text-[#F4E87C] font-semibold">${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
      </div>
      
      <p className="text-[#80A1C1] mb-4 text-sm leading-relaxed">{goal.description}</p>
      
      <div className="mb-4">
        <div className="h-3 bg-[#0C291C] rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#80A1C1] to-[#F4E87C] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-right text-xs text-[#F4E87C] mt-1">{Math.round(progress)}%</div>
      </div>
      
      <div className="mb-4 text-xs flex justify-between items-center">
        <span className="text-[#80A1C1]">Deadline: {goal.deadline}</span>
        <span className={`px-2 py-1 rounded-xl font-medium text-xs ${goal.priority.toLowerCase() === 'high' ? 'bg-red-900 text-red-200' : goal.priority.toLowerCase() === 'medium' ? 'bg-blue-900 text-blue-200' : 'bg-green-900 text-green-200'}`}>
          {goal.priority}
        </span>
      </div>
      
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white px-4 py-2 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          Update
        </button>
      </div>
    </div>
  );
};

export default GoalCard;