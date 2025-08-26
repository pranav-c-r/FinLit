import React from 'react';
import { Link } from 'react-router-dom';


const LessonCard = ({ lesson, completed }) => {
  return (
    <div className={`card p-6 rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:translate-y-[-5px] hover:shadow-xl relative overflow-hidden ${completed ? 'opacity-80 border-l-4 border-green-400' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="text-4xl">{lesson.icon}</div>
        {completed && <span className="bg-green-400 text-gray-900 px-2 py-1 rounded-xl text-xs font-semibold">Completed</span>}
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-finlit-blue-light">{lesson.title}</h3>
      <p className="text-gray-300 mb-4 text-sm leading-relaxed">{lesson.description}</p>
      
      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="text-orange-400">{lesson.duration}</span>
        <span className={`px-2 py-1 rounded-md font-medium text-xs ${lesson.difficulty.toLowerCase() === 'beginner' ? 'bg-green-400/20 text-green-400' : lesson.difficulty.toLowerCase() === 'intermediate' ? 'bg-finlit-blue-light/20 text-finlit-blue-light' : 'bg-orange-400/20 text-orange-400'}`}>
          {lesson.difficulty}
        </span>
      </div>
      
      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="text-green-400 font-medium">+{lesson.xpReward} XP</span>
        <span className="text-orange-400 font-medium">+{lesson.coinReward} 🪙</span>
      </div>
      
      <Link 
        to={`/lessons/${lesson.id}`} 
        className="block w-full text-center py-3 px-4 rounded-md bg-finlit-blue-light text-white font-semibold hover:bg-finlit-blue-dark transition duration-200"
      >
        {completed ? 'Review' : 'Start'}
      </Link>
    </div>
  );
};

export default LessonCard;