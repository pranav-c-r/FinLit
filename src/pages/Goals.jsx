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
    <div className="min-h-screen bg-[#01110A] p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-[#80A1C1] rounded-full -top-36 -right-36 opacity-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#F4E87C] rounded-full -bottom-48 -left-48 opacity-10"></div>
      </div>

      <div ref={headerRef} className="relative z-10 mb-8 transition-all duration-700 ease-out opacity-0 -translate-y-5 flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F4E87C] to-[#80A1C1] bg-clip-text text-transparent">
            Financial Goals
          </h1>
          <p className="text-[#80A1C1] mt-2">Set and track your financial objectives</p>
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
        <div className="relative z-10 bg-[#0A1F14] rounded-2xl p-12 text-center border border-[#1C3B2A] shadow-xl transform transition-all duration-500 hover:scale-105">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <h3 className="text-[#F4E87C] text-2xl font-semibold mb-2">No goals yet</h3>
          <p className="text-[#80A1C1] mb-6">Create your first financial goal to get started</p>
          <button 
            className="bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => setShowForm(true)}
          >
            Create Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {user.goals.map((goal, index) => (
            <div 
              key={goal.id} 
              className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{ transitionDelay: `${index * 100}ms` }}
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