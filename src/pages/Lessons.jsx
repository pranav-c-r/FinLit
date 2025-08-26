import React from 'react';
import { useApp } from '../context/AppContext';
import LessonCard from '../components/lessons/LessonCard';
import { lessons } from '../data/mockData';


const Lessons = () => {
  const { state } = useApp();
  const { user } = state;

  const categories = [...new Set(lessons.map(lesson => lesson.category))];

  return (
    <div className="p-4 md:p-8">
      <div className="page-header">
        <h1>Financial Lessons</h1>
        <p>Learn essential financial skills through interactive lessons</p>
      </div>

      <div className="categories-section mb-2">
        <h2 className="section-title">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {categories.map(category => (
            <div key={category} className="card text-center p-6 transition-transform duration-300 ease-in-out hover:-translate-y-1 cursor-pointer">
              <h3 className="text-duolingo-green text-lg font-semibold mb-2">{category}</h3>
              <p className="text-gray-700 text-sm">{lessons.filter(l => l.category === category).length} lessons</p>
            </div>
          ))}
        </div>
      </div>

      <div className="all-lessons-section">
        <h2 className="section-title">All Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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