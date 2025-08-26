import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';


const Goals = () => {
  const { state } = useApp();
  const { user } = state;
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-4 md:p-8">
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
        <div className="card text-center p-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-green-500 text-2xl font-semibold mb-2">No goals yet</h3>
          <p className="text-gray-500 mb-6">Create your first financial goal to get started</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Create Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;