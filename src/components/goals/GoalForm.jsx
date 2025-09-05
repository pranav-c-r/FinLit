import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const GoalForm = ({ onClose }) => {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    priority: 'medium'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newGoal = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline,
      priority: formData.priority
    };
    
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
    onClose();
  };

  return (
    <form className="bg-gray-900 rounded-2xl p-6 border border-blue-800 shadow-xl" onSubmit={handleSubmit}>
      <h3 className="text-blue-300 mb-6 text-center text-2xl font-semibold">Create New Goal</h3>
      
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2 text-blue-300 font-medium">Goal Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 border border-blue-800 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-blue-500 transition-colors duration-300"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block mb-2 text-blue-300 font-medium">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 border border-blue-800 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-blue-500 transition-colors duration-300"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="targetAmount" className="block mb-2 text-blue-300 font-medium">Target Amount ($)</label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            required
            min="1"
            className="w-full p-3 border border-blue-800 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-blue-500 transition-colors duration-300"
          />
        </div>
        
        <div>
          <label htmlFor="currentAmount" className="block mb-2 text-blue-300 font-medium">Current Amount ($)</label>
          <input
            type="number"
            id="currentAmount"
            name="currentAmount"
            value={formData.currentAmount}
            onChange={handleChange}
            min="0"
            className="w-full p-3 border border-blue-800 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-blue-500 transition-colors duration-300"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="deadline" className="block mb-2 text-blue-300 font-medium">Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full p-3 border border-blue-800 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-blue-500 transition-colors duration-300"
          />
        </div>
        
        <div>
          <label htmlFor="priority" className="block mb-2 text-blue-300 font-medium">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-3 border border-blue-800 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-blue-500 transition-colors duration-300"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end gap-4">
        <button 
          type="button" 
          className="px-6 py-3 rounded-xl text-white bg-blue-800 hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          onClick={onClose}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition duration-300 transform hover:scale-105"
        >
          Create Goal
        </button>
      </div>
    </form>
  );
};

export default GoalForm;