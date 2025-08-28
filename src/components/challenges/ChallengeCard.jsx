import React from 'react';
import { Link } from 'react-router-dom';

const ChallengeCard = ({ challenge, completed }) => {
  return (
    <div className={`card relative overflow-hidden transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-2 p-6 shadow-lg ${completed ? 'opacity-90 border-l-4 border-primary' : ''}`}>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-5xl transform hover:scale-110 transition-transform duration-300">{challenge.icon}</div>
        {completed && (
          <span className="px-3 py-1 bg-gradient-to-r from-primary-light to-primary text-white text-xs font-bold rounded-full animate-pulse-slow">
            Completed
          </span>
        )}
      </div>
      
      <h3 className="text-xl mb-2 heading-gradient font-semibold">{challenge.title}</h3>
      <p className="text-gray-300 mb-4 text-sm leading-relaxed">{challenge.description}</p>
      
      <div className="mb-4 text-xs flex justify-between items-center">
        <span className="text-primary-light">{challenge.duration}</span>
        <span className={`px-2 py-1 rounded-xl font-medium text-xs ${challenge.difficulty.toLowerCase() === 'beginner' ? 'bg-green-400/20 text-green-400' : challenge.difficulty.toLowerCase() === 'intermediate' ? 'bg-primary-light/20 text-primary-light' : 'bg-accent/20 text-accent'}`}>
          {challenge.difficulty}
        </span>
      </div>
      
      <div className="mb-4 text-sm flex justify-between items-center">
        <span className="gradient-text">+{challenge.xpReward} XP</span>
        <span className="text-accent">+{challenge.coinReward} 🪙</span>
      </div>
      
      <Link 
        to={`/challenges/${challenge.id}`} 
        className="block w-full text-center no-underline btn-primary py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        {completed ? 'Review' : 'Start Challenge'}
      </Link>
    </div>
  );
};

export default ChallengeCard;