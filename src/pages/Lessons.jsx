import React from 'react';
import { useApp } from '../context/AppContext';
import LessonCard from '../components/lessons/LessonCard';
import { lessons } from '../data/mockData';
import './Lessons.css';

const Lessons = () => {
  const { state } = useApp();
  const { user } = state;

  const categories = [...new Set(lessons.map(lesson => lesson.category))];

  return (
    <div className="lessons-page">
      <div className="page-header">
        <h1>Financial Lessons</h1>
        <p>Learn essential financial skills through interactive lessons</p>
      </div>

      <div className="categories-section mb-2">
        <h2 className="section-title">Categories</h2>
        <div className="categories-grid grid grid-4 gap-1">
          {categories.map(category => (
            <div key={category} className="category-card card">
              <h3>{category}</h3>
              <p>{lessons.filter(l => l.category === category).length} lessons</p>
            </div>
          ))}
        </div>
      </div>

      <div className="all-lessons-section">
        <h2 className="section-title">All Lessons</h2>
        <div className="lessons-grid grid grid-2 gap-1">
          {lessons.map(lesson => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson} 
              completed={user.completedLessons.includes(lesson.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lessons;