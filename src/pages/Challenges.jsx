import React from 'react';
import { useApp } from '../context/AppContext';
import ChallengeCard from '../components/challenges/ChallengeCard';
import { challenges } from '../data/mockData';
import './Challenges.css';

const Challenges = () => {
  const { state } = useApp();
  const { user } = state;

  const categories = [...new Set(challenges.map(challenge => challenge.category))];

  return (
    <div className="challenges-page">
      <div className="page-header">
        <h1>Financial Challenges</h1>
        <p>Test your knowledge with real-world financial challenges</p>
      </div>

      <div className="categories-section mb-2">
        <h2 className="section-title">Categories</h2>
        <div className="categories-grid grid grid-3 gap-1">
          {categories.map(category => (
            <div key={category} className="category-card card">
              <h3>{category}</h3>
              <p>{challenges.filter(c => c.category === category).length} challenges</p>
            </div>
          ))}
        </div>
      </div>

      <div className="all-challenges-section">
        <h2 className="section-title">All Challenges</h2>
        <div className="challenges-grid grid grid-2 gap-1">
          {challenges.map(challenge => (
            <ChallengeCard 
              key={challenge.id} 
              challenge={challenge} 
              completed={user.completedChallenges.includes(challenge.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Challenges;