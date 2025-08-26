import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';
import './Goals.css';

const Goals = () => {
  const { state } = useApp();
  const { user } = state;
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="goals-page">
      <div className="page-header flex-between">
        <div>
          <h1>Financial Goals</h1>
          <p>Set and track your financial objectives</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Goal'}
        </button>
      </div>

      {showForm && (
        <div className="goal-form-section card mb-2">
          <GoalForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {user.goals.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🎯</div>
          <h3>No goals yet</h3>
          <p>Create your first financial goal to get started</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Create Goal
          </button>
        </div>
      ) : (
        <div className="goals-grid grid grid-2 gap-1">
          {user.goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;