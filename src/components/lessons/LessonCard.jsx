import React from 'react';
import { Link } from 'react-router-dom';
import './LessonCard.css';

const LessonCard = ({ lesson, completed }) => {
  return (
    <div className={`lesson-card card ${completed ? 'completed' : ''}`}>
      <div className="lesson-header flex-between">
        <div className="lesson-icon">{lesson.icon}</div>
        {completed && <span className="completed-badge">Completed</span>}
      </div>
      
      <h3 className="lesson-title">{lesson.title}</h3>
      <p className="lesson-description">{lesson.description}</p>
      
      <div className="lesson-meta flex-between">
        <span className="lesson-duration">{lesson.duration}</span>
        <span className={`lesson-difficulty ${lesson.difficulty.toLowerCase()}`}>
          {lesson.difficulty}
        </span>
      </div>
      
      <div className="lesson-rewards flex-between">
        <span className="xp-reward">+{lesson.xpReward} XP</span>
        <span className="coin-reward">+{lesson.coinReward} 🪙</span>
      </div>
      
      <Link 
        to={`/lessons/${lesson.id}`} 
        className="btn btn-primary start-lesson"
      >
        {completed ? 'Review' : 'Start'}
      </Link>
    </div>
  );
};

export default LessonCard;