import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';

const Goals = () => {
  const { state, dispatch } = useApp();
  const { user } = state;
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'priority'
  const [searchQuery, setSearchQuery] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [recentGoal, setRecentGoal] = useState(null);
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

  // Check for newly completed goals to show celebration
  useEffect(() => {
    const completedGoals = user.goals.filter(goal => goal.completed);
    if (completedGoals.length > 0) {
      const mostRecent = completedGoals[completedGoals.length - 1];
      if (!recentGoal || recentGoal.id !== mostRecent.id) {
        setRecentGoal(mostRecent);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  }, [user.goals]);

  // Filter and sort goals
  const filteredGoals = user.goals
    .filter(goal => {
      if (filter === 'active') return !goal.completed;
      if (filter === 'completed') return goal.completed;
      return true;
    })
    .filter(goal => 
      goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.targetAmount - a.targetAmount;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Calculate progress statistics
  const totalGoals = user.goals.length;
  const completedGoals = user.goals.filter(goal => goal.completed).length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const totalValue = user.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const savedValue = user.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const handleAddGoal = (goal) => {
    dispatch({
      type: 'ADD_GOAL',
      payload: goal
    });
    setShowForm(false);
  };

  const CelebrationBanner = () => {
    if (!showCelebration || !recentGoal) return null;

    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-xl shadow-xl border border-blue-400/30 animate-bounce-in">
        <div className="flex items-center">
          <div className="text-2xl mr-3">🎉</div>
          <div>
            <h3 className="font-bold">Goal Completed!</h3>
            <p className="text-sm">You've successfully completed "{recentGoal.title}"</p>
          </div>
          <button 
            onClick={() => setShowCelebration(false)}
            className="ml-4 text-blue-100 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-slate-900 to-slate-800">
      <CelebrationBanner />
      
      {/* Header Section */}
      <div ref={headerRef} className="relative mb-8 transition-all duration-700 ease-out opacity-0 -translate-y-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Financial Goals
          </h1>
          <p className="text-blue-200 mt-2">Level up your financial future</p>
        </div>
        
        {/* Stats Overview */}
        <div className="flex gap-4">
          <div className="bg-slate-800 rounded-xl p-3 shadow-lg border border-blue-700/30 transition-transform hover:scale-105">
            <p className="text-blue-400 text-sm">Goals</p>
            <p className="text-2xl font-bold text-blue-400">{totalGoals}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-3 shadow-lg border border-blue-700/30 transition-transform hover:scale-105">
            <p className="text-blue-400 text-sm">Completed</p>
            <p className="text-2xl font-bold text-blue-400">{completedGoals}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-3 shadow-lg border border-blue-700/30 transition-transform hover:scale-105">
            <p className="text-blue-400 text-sm">Rate</p>
            <p className="text-2xl font-bold text-blue-400">{completionRate}%</p>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-8 bg-slate-800 rounded-2xl p-6 shadow-lg border border-blue-700/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-400">Overall Progress</h2>
          <span className="text-blue-300 bg-blue-900/30 px-3 py-1 rounded-full text-sm">
            ₹{savedValue.toLocaleString()} / ₹{totalValue.toLocaleString()}
          </span>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-4 mb-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-4 rounded-full transition-all duration-700 shadow-md" 
            style={{ width: `${totalValue > 0 ? (savedValue / totalValue) * 100 : 0}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-blue-400">
          <span>Total Saved</span>
          <span>{(totalValue > 0 ? (savedValue / totalValue) * 100 : 0).toFixed(0)}%</span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 bg-slate-800/50 rounded-xl p-4 border border-blue-700/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-blue-300 mb-2">Search Goals</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-slate-700 border border-blue-700/30 rounded-lg text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search goals by title or description..."
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-700 border border-blue-700/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Newest First</option>
              <option value="amount">Amount (High to Low)</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg border border-blue-500'
                  : 'bg-slate-700 text-blue-300 border border-slate-600 hover:bg-slate-600'
              }`}
            >
              All Goals
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                filter === 'active'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg border border-blue-500'
                  : 'bg-slate-700 text-blue-300 border border-slate-600 hover:bg-slate-600'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg border border-blue-500'
                  : 'bg-slate-700 text-blue-300 border border-slate-600 hover:bg-slate-600'
              }`}
            >
              Completed
            </button>
          </div>
          
          <button 
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center"
            onClick={() => setShowForm(!showForm)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {showForm ? 'Cancel' : 'New Goal'}
          </button>
        </div>
      </div>

      {/* Goal Form */}
      {showForm && (
        <div ref={formRef} className="relative mb-8 transition-all duration-500 ease-out opacity-0 scale-95">
          <GoalForm onSubmit={handleAddGoal} onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="relative bg-slate-800 rounded-2xl p-12 text-center border border-blue-700/30 shadow-xl">
          <div className="text-6xl mb-4 animate-pulse">🎯</div>
          <h3 className="text-blue-400 text-2xl font-semibold mb-2">
            {searchQuery ? 'No matching goals' : 
             filter === 'completed' ? 'No completed goals yet' : 'No goals yet'}
          </h3>
          <p className="text-blue-300 mb-6">
            {searchQuery ? 'Try adjusting your search terms' :
             filter === 'completed' 
              ? 'Complete your first goal to see it here!' 
              : 'Create your first financial goal to get started'}
          </p>
          {filter !== 'completed' && !searchQuery && (
            <button 
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center mx-auto"
              onClick={() => setShowForm(true)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Your First Goal
            </button>
          )}
          {searchQuery && (
            <button 
              className="bg-slate-700 text-blue-300 px-6 py-3 rounded-xl font-semibold border border-slate-600 hover:bg-slate-600 transition-colors"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
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
        <div className="mt-8 bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-4 text-blue-200 text-center shadow-lg border border-blue-700/50">
          <h3 className="font-bold text-lg mb-1">Keep going!</h3>
          <p className="text-sm">You've completed {completedGoals} of {totalGoals} goals</p>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" 
              style={{ width: `${(completedGoals / totalGoals) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* All Goals Completed Banner */}
      {completedGoals > 0 && completedGoals === totalGoals && totalGoals > 0 && (
        <div className="mt-8 bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-4 text-center shadow-lg border border-blue-500/50">
          <h3 className="font-bold text-lg text-blue-200 mb-1">🎉 Goal Master! 🎉</h3>
          <p className="text-blue-300 text-sm">You've completed all your financial goals! Amazing achievement!</p>
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-blue-700/20">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">Goal Setting Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/50 p-4 rounded-lg border border-blue-700/30">
            <div className="text-blue-400 text-2xl mb-2">💰</div>
            <h4 className="text-white font-medium mb-1">Be Specific</h4>
            <p className="text-blue-300 text-sm">Set clear, measurable goals with specific amounts and deadlines.</p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg border border-blue-700/30">
            <div className="text-blue-400 text-2xl mb-2">📊</div>
            <h4 className="text-white font-medium mb-1">Track Progress</h4>
            <p className="text-blue-300 text-sm">Regularly update your progress to stay motivated and on track.</p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg border border-blue-700/30">
            <div className="text-blue-400 text-2xl mb-2">🎯</div>
            <h4 className="text-white font-medium mb-1">Set Priorities</h4>
            <p className="text-blue-300 text-sm">Focus on high-priority goals first to maximize your financial impact.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;