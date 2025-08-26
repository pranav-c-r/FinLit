import React from 'react';
import { useApp } from '../context/AppContext';
import ChallengeCard from '../components/challenges/ChallengeCard';
import { challenges } from '../data/mockData';


const Challenges = () => {
  const { state } = useApp();
  const { user } = state;

  const categories = [...new Set(challenges.map(challenge => challenge.category))];

  return (
    <div className="p-4 md:p-8">
      <div className="page-header">
        <h1>Financial Challenges</h1>
        <p>Test your knowledge with real-world financial challenges</p>
      </div>

      <div className="categories-section mb-2">
        <h2 className="section-title">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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