import React from 'react';
import './GoalCard.css';

const GoalCard = ({ goal }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  
  return (
    <div className="goal-card card">
      <div className="goal-header flex-between">
        <h3 className="goal-title">{goal.title}</h3>
        <span className="goal-amount">${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
      </div>
      
      <p className="goal-description">{goal.description}</p>
      
      <div className="goal-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-percentage">{Math.round(progress)}%</div>
      </div>
      
      <div className="goal-meta flex-between">
        <span className="goal-deadline">Deadline: {goal.deadline}</span>
        <span className="goal-priority">{goal.priority}</span>
      </div>
      
      <div className="goal-actions">
        <button className="btn btn-secondary">Update</button>
      </div>
    </div>
  );
};

export default GoalCard;