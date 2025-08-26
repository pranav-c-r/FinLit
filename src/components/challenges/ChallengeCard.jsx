import React from 'react';
import { Link } from 'react-router-dom';
import './ChallengeCard.css';

const ChallengeCard = ({ challenge, completed }) => {
  return (
    <div className={`challenge-card card ${completed ? 'completed' : ''}`}>
      <div className="challenge-header flex-between">
        <div className="challenge-icon">{challenge.icon}</div>
        {completed && <span className="completed-badge">Completed</span>}
      </div>
      
      <h3 className="challenge-title">{challenge.title}</h3>
      <p className="challenge-description">{challenge.description}</p>
      
      <div className="challenge-meta flex-between">
        <span className="challenge-duration">{challenge.duration}</span>
        <span className={`challenge-difficulty ${challenge.difficulty.toLowerCase()}`}>
          {challenge.difficulty}
        </span>
      </div>
      
      <div className="challenge-rewards flex-between">
        <span className="xp-reward">+{challenge.xpReward} XP</span>
        <span className="coin-reward">+{challenge.coinReward} 🪙</span>
      </div>
      
      <Link 
        to={`/challenges/${challenge.id}`} 
        className="btn btn-secondary start-challenge"
      >
        {completed ? 'Review' : 'Start Challenge'}
      </Link>
    </div>
  );
};

export default ChallengeCard;