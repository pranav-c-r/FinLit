import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';

const Goals = () => {
  const { state } = useApp();
  const { user } = state;
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const headerRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      setTimeout(() => {
        headerRef.current.classList.remove('opacity-0', '-translate-y-5');
        headerRef.current.classList.add('opacity-100', 'translate-y-0');
      }, 100);
    }

    if (showForm && formRef.current) {
      setTimeout(() => {
        formRef.current.classList.remove('opacity-0', 'scale-95');
        formRef.current.classList.add('opacity-100', 'scale-100');
      }, 100);
    }
  }, [showForm]);

  // Filter goals based on status
  const filteredGoals = user.goals.filter(goal => {
    if (filter === 'all') return true;
    if (filter === 'active') return !goal.completed;
    if (filter === 'completed') return goal.completed;
    return true;
  });

  // Calculate progress statistics
  const totalGoals = user.goals.length;
  const completedGoals = user.goals.filter(goal => goal.completed).length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const totalValue = user.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const savedValue = user.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header Section */}
      <div ref={headerRef} className="relative mb-8 transition-all duration-700 ease-out opacity-0 -translate-y-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Financial Goals
          </h1>
          <p className="text-green-200 mt-2">Level up your financial future</p>
        </div>
        
        {/* Stats Overview */}
        <div className="flex gap-4">
          <div className="bg-gray-800 rounded-xl p-3 shadow-lg border border-green-700/30">
            <p className="text-green-400 text-sm">Goals</p>
            <p className="text-2xl font-bold text-green-400">{totalGoals}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 shadow-lg border border-green-700/30">
            <p className="text-green-400 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-400">{completedGoals}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 shadow-lg border border-green-700/30">
            <p className="text-green-400 text-sm">Rate</p>
            <p className="text-2xl font-bold text-green-400">{completionRate}%</p>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-8 bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-700/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-400">Overall Progress</h2>
          <span className="text-green-300 bg-green-900/30 px-3 py-1 rounded-full text-sm">
            {savedValue.toLocaleString()} / {totalValue.toLocaleString()}
          </span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-700 h-4 rounded-full transition-all duration-700 shadow-md" 
            style={{ width: `${totalValue > 0 ? (savedValue / totalValue) * 100 : 0}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-green-400">
          <span>Total Saved</span>
          <span>{(totalValue > 0 ? (savedValue / totalValue) * 100 : 0).toFixed(0)}%</span>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg border border-green-500'
                : 'bg-gray-800 text-green-300 border border-gray-700 hover:bg-gray-700'
            }`}
          >
            All Goals
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              filter === 'active'
                ? 'bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg border border-green-500'
                : 'bg-gray-800 text-green-300 border border-gray-700 hover:bg-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg border border-green-500'
                : 'bg-gray-800 text-green-300 border border-gray-700 hover:bg-gray-700'
            }`}
          >
            Completed
          </button>
        </div>
        
        <button 
          className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center"
          onClick={() => setShowForm(!showForm)}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          {showForm ? 'Cancel' : 'New Goal'}
        </button>
      </div>

      {/* Goal Form */}
      {showForm && (
        <div ref={formRef} className="relative mb-8 transition-all duration-500 ease-out opacity-0 scale-95">
          <GoalForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="relative bg-gray-800 rounded-2xl p-12 text-center border border-green-700/30 shadow-xl">
          <div className="text-6xl mb-4 animate-pulse">🎯</div>
          <h3 className="text-green-400 text-2xl font-semibold mb-2">
            {filter === 'completed' ? 'No completed goals yet' : 'No goals yet'}
          </h3>
          <p className="text-green-300 mb-6">
            {filter === 'completed' 
              ? 'Complete your first goal to see it here!' 
              : 'Create your first financial goal to get started'}
          </p>
          {filter !== 'completed' && (
            <button 
              className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center mx-auto"
              onClick={() => setShowForm(true)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Goal
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal, index) => (
            <div 
              key={goal.id} 
              className="transform transition-all duration-500 hover:scale-[1.02] opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <GoalCard goal={goal} />
            </div>
          ))}
        </div>
      )}

      {/* Achievement Banner */}
      {completedGoals > 0 && completedGoals < totalGoals && (
        <div className="mt-8 bg-gradient-to-r from-green-800 to-green-900 rounded-2xl p-4 text-green-200 text-center shadow-lg border border-green-700/50">
          <h3 className="font-bold text-lg mb-1">Keep going!</h3>
          <p className="text-sm">You've completed {completedGoals} of {totalGoals} goals</p>
        </div>
      )}

      {/* All Goals Completed Banner */}
      {completedGoals > 0 && completedGoals === totalGoals && totalGoals > 0 && (
        <div className="mt-8 bg-gradient-to-r from-green-700 to-green-900 rounded-2xl p-4 text-center shadow-lg border border-green-500/50">
          <h3 className="font-bold text-lg text-green-200 mb-1">🎉 Goal Master! 🎉</h3>
          <p className="text-green-300 text-sm">You've completed all your financial goals! Amazing achievement!</p>
        </div>
      )}
    </div>
  );
};

export default Goals;