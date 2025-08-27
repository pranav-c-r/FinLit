import React from 'react';
import { Link } from 'react-router-dom';

const ChallengeCard = ({ challenge, completed }) => {
  return (
    <div className={`relative overflow-hidden transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-2 bg-[#0A1F14] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg ${completed ? 'opacity-90 border-l-4 border-[#F4E87C]' : ''}`}>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-5xl transform hover:scale-110 transition-transform duration-300">{challenge.icon}</div>
        {completed && (
          <span className="px-3 py-1 bg-[#F4E87C] text-[#01110A] text-xs font-bold rounded-full animate-pulse">
            Completed
          </span>
        )}
      </div>
      
      <h3 className="text-xl mb-2 text-[#F4E87C] font-semibold">{challenge.title}</h3>
      <p className="text-[#80A1C1] mb-4 text-sm leading-relaxed">{challenge.description}</p>
      
      <div className="mb-4 text-xs flex justify-between items-center">
        <span className="text-[#F4E87C]">{challenge.duration}</span>
        <span className={`px-2 py-1 rounded-xl font-medium text-xs ${challenge.difficulty.toLowerCase() === 'beginner' ? 'bg-green-900 text-green-200' : challenge.difficulty.toLowerCase() === 'intermediate' ? 'bg-blue-900 text-blue-200' : 'bg-red-900 text-red-200'}`}>
          {challenge.difficulty}
        </span>
      </div>
      
      <div className="mb-4 text-sm flex justify-between items-center">
        <span className="xp-reward text-[#F4E87C]">+{challenge.xpReward} XP</span>
        <span className="coin-reward text-[#F4E87C]">+{challenge.coinReward} 🪙</span>
      </div>
      
      <Link 
        to={`/challenges/${challenge.id}`} 
        className="block w-full text-center no-underline bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        {completed ? 'Review' : 'Start Challenge'}
      </Link>
    </div>
  );
};

export default ChallengeCard;