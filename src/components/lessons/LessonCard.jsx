import React from 'react';
import { Link } from 'react-router-dom';

const LessonCard = ({ lesson, completed }) => {
  return (
    <div className={`card p-6 shadow-lg transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-2 relative overflow-hidden ${completed ? 'opacity-90 border-l-4 border-primary' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="text-4xl transform hover:scale-110 transition-transform duration-300">{lesson.icon}</div>
        {completed && (
          <span className="px-3 py-1 bg-gradient-to-r from-primary-light to-primary text-white text-xs font-bold rounded-full animate-pulse-slow">
            Completed
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-semibold mb-2 heading-gradient">{lesson.title}</h3>
      <p className="text-gray-300 mb-4 text-sm leading-relaxed">{lesson.description}</p>
      
      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="text-primary-light">{lesson.duration}</span>
        <span className={`px-2 py-1 rounded-xl font-medium text-xs ${lesson.difficulty.toLowerCase() === 'beginner' ? 'bg-green-400/20 text-green-400' : lesson.difficulty.toLowerCase() === 'intermediate' ? 'bg-primary-light/20 text-primary-light' : 'bg-accent/20 text-accent'}`}>
          {lesson.difficulty}
        </span>
      </div>
      
      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="gradient-text font-medium">+{lesson.xpReward} XP</span>
        <span className="text-accent font-medium">+{lesson.coinReward} 🪙</span>
      </div>
      
      <Link 
        to={`/lessons/${lesson.id}`} 
        className="block w-full text-center py-3 px-4 rounded-xl btn-primary"
      >
        {completed ? 'Review' : 'Start'}
      </Link>
    </div>
  );
};

export default LessonCard;