import React from 'react';


const GoalCard = ({ goal }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  
  return (
    <div className="card transition-transform duration-300 ease-in-out hover:translate-y-[-5px]">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg text-primary">{goal.title}</h3>
        <span className="text-accent font-semibold">${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
      </div>
      
      <p className="text-text-secondary mb-4 text-sm leading-relaxed">{goal.description}</p>
      
      <div className="mb-4">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-right text-xs text-primary mt-1">{Math.round(progress)}%</div>
      </div>
      
      <div className="mb-4 text-xs flex justify-between items-center">
        <span className="text-secondary">Deadline: {goal.deadline}</span>
        <span className={`px-2 py-1 rounded-xl font-medium text-xs ${goal.priority.toLowerCase() === 'high' ? 'bg-red-200 text-red-800' : goal.priority.toLowerCase() === 'medium' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}></span>
      </div>
      
      <div className="flex justify-end">
        <button className="btn btn-secondary">Update</button>
      </div>
    </div>
  );
};

export default GoalCard;