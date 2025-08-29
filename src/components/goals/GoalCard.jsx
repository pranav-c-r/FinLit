import React from 'react';

const GoalCard = ({ goal }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  
  return (
    <div className="card p-6 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg gradient-text font-semibold">{goal.title}</h3>
        <span className="gradient-text font-semibold">${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
      </div>
      
      <p className="text-gray-300 mb-4 text-sm leading-relaxed">{goal.description}</p>
      
      <div className="mb-4">
        <div className="h-3 bg-background-dark rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-primary-light to-primary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-right text-xs text-accent mt-1">{Math.round(progress)}%</div>
      </div>
      
      <div className="mb-4 text-xs flex justify-between items-center">
        <span className="text-gray-300">Deadline: {goal.deadline}</span>
        <span className={`px-2 py-1 rounded-xl font-medium text-xs ${goal.priority.toLowerCase() === 'high' ? 'bg-red-900/50 text-red-200' : goal.priority.toLowerCase() === 'medium' ? 'bg-primary-light/50 text-blue-200' : 'bg-green-900/50 text-green-200'}`}>
          {goal.priority}
        </span>
      </div>
      
      <div className="flex justify-end">
        <button className="btn-primary px-4 py-2 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          Update
        </button>
      </div>
    </div>
  );
};

export default GoalCard;