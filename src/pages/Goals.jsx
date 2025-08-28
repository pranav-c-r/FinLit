import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';

const Goals = () => {
  const { state } = useApp();
  const { user } = state;
  const [showForm, setShowForm] = useState(false);
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

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Additional animated elements specific to Goals page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-primary-light/30 rounded-full -top-36 -left-36 animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-primary/20 rounded-full -bottom-48 -right-48 animate-float animate-delay-1000"></div>
        <div className="absolute w-64 h-64 bg-accent/25 rounded-full top-1/3 left-1/4 animate-pulse-slower animate-delay-2000"></div>
      </div>

      <div ref={headerRef} className="relative z-10 mb-8 transition-all duration-700 ease-out opacity-0 -translate-y-5 flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
            Financial Goals
          </h1>
          <p className="text-gray-300 mt-2">Set and track your financial objectives</p>
        </div>
        <button 
          className="bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Goal'}
        </button>
      </div>

      {showForm && (
        <div ref={formRef} className="relative z-10 mb-8 transition-all duration-500 ease-out opacity-0 scale-95">
          <GoalForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {user.goals.length === 0 ? (
        <div className="relative z-10 bg-background-dark rounded-2xl p-12 text-center border border-primary/20 shadow-xl transform transition-all duration-500 hover:scale-105">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <h3 className="text-accent text-2xl font-semibold mb-2">No goals yet</h3>
          <p className="text-primary-light mb-6">Create your first financial goal to get started</p>
          <button 
            className="btn-primary px-4 py-2 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center"
            onClick={() => setShowForm(true)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {user.goals.map((goal, index) => (
            <div 
              key={goal.id} 
              className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms`, transitionDelay: `${index * 100}ms` }}
            >
              <GoalCard goal={goal} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;