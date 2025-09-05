import React from 'react';

const GoalCard = ({ goal }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  
  return (
    <div className="card p-6 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 bg-gray-900 border border-gray-700 rounded-xl">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-300">{goal.title}</h3>
        <span className="font-semibold text-blue-300">${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
      </div>
      
      <p className="text-gray-400 mb-4 text-sm leading-relaxed">{goal.description}</p>
      
      <div className="mb-4">
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-right text-xs text-blue-400 mt-1">{Math.round(progress)}%</div>
      </div>
      
      <div className="mb-4 text-xs flex justify-between items-center">
        <span className="text-gray-400">Deadline: {goal.deadline}</span>
        <span className={`px-2 py-1 rounded-xl font-medium text-xs ${goal.priority.toLowerCase() === 'high' ? 'bg-red-800/40 text-red-200' : goal.priority.toLowerCase() === 'medium' ? 'bg-yellow-800/40 text-yellow-200' : 'bg-blue-800/40 text-blue-200'}`}>
          {goal.priority}
        </span>
      </div>
      
      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          Update
        </button>
      </div>
    </div>
  );
};

export default GoalCard;