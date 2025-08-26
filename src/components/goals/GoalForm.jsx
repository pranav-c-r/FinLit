import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './GoalForm.css';

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
    <form className="goal-form" onSubmit={handleSubmit}>
      <h3>Create New Goal</h3>
      
      <div className="form-group">
        <label htmlFor="title">Goal Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
      </div>
      
      <div className="form-row grid grid-2 gap-1">
        <div className="form-group">
          <label htmlFor="targetAmount">Target Amount ($)</label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="currentAmount">Current Amount ($)</label>
          <input
            type="number"
            id="currentAmount"
            name="currentAmount"
            value={formData.currentAmount}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>
      
      <div className="form-row grid grid-2 gap-1">
        <div className="form-group">
          <label htmlFor="deadline">Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Create Goal
        </button>
      </div>
    </form>
  );
};

export default GoalForm;