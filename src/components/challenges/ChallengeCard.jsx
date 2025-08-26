import React from 'react';
import { Link } from 'react-router-dom';


const ChallengeCard = ({ challenge, completed }) => {
  return (
    <div className={`relative overflow-hidden transition-all duration-300 ease-in-out hover:translate-y-[-5px] hover:shadow-lg card ${completed ? 'opacity-80 border-l-4 border-accent' : ''}`}>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-4xl">{challenge.icon}</div>
        {completed && <span className="completed-badge">Completed</span>}
      </div>
      
      <h3 className="text-xl mb-2 text-accent">{challenge.title}</h3>
      <p className="text-text-secondary mb-4 text-sm leading-relaxed">{challenge.description}</p>
      
      <div className="mb-4 text-xs flex justify-between items-center">
        <span className="text-primary">{challenge.duration}</span>
        <span className={`px-2 py-1 rounded-xl font-medium text-xs ${challenge.difficulty.toLowerCase() === 'beginner' ? 'bg-green-200 text-green-800' : challenge.difficulty.toLowerCase() === 'intermediate' ? 'bg-blue-200 text-blue-800' : 'bg-red-200 text-red-800'}`}>
          {challenge.difficulty}
        </span>
      </div>
      
      <div className="mb-4 text-sm flex justify-between items-center">
        <span className="xp-reward">+{challenge.xpReward} XP</span>
        <span className="coin-reward">+{challenge.coinReward} 🪙</span>
      </div>
      
      <Link 
        to={`/challenges/${challenge.id}`} 
        className="w-full text-center no-underline btn btn-secondary"
      >
        {completed ? 'Review' : 'Start Challenge'}
      </Link>
    </div>
  );
};

export default ChallengeCard;