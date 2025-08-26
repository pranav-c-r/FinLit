import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatsCard from '../components/dashboard/StatsCard';
import ProgressChart from '../components/dashboard/ProgressChart';
import LessonCard from '../components/lessons/LessonCard';
import ChallengeCard from '../components/challenges/ChallengeCard';
import { lessons, challenges } from '../data/mockData';
import './Home.css';

const Home = () => {
  const { state } = useApp();
  const { user } = state;

  // Get first 3 lessons and challenges
  const featuredLessons = lessons.slice(0, 3);
  const featuredChallenges = challenges.slice(0, 3);

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Welcome back, {user.name}!</h1>
        <p>Continue your financial literacy journey</p>
      </div>

      <div className="stats-grid grid grid-2 gap-2 mb-2">
        <StatsCard 
          title="Current Level" 
          value={user.level} 
          icon="🎯" 
          color="#DC965A" 
        />
        <StatsCard 
          title="FinCoins" 
          value={user.coins} 
          icon="🪙" 
          color="#ACF39D" 
        />
      </div>

      <div className="progress-section card mb-2">
        <h2 className="section-title">Your Progress</h2>
        <ProgressChart 
          xp={user.xp} 
          nextLevelXp={user.nextLevelXp} 
        />
      </div>

      <div className="featured-section mb-2">
        <div className="section-header flex-between mb-1">
          <h2 className="section-title">Continue Learning</h2>
          <Link to="/lessons" className="see-all">See all</Link>
        </div>
        
        <div className="lessons-grid grid grid-2 gap-1">
          {featuredLessons.map(lesson => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson} 
              completed={user.completedLessons.includes(lesson.id)}
            />
          ))}
        </div>
      </div>

      <div className="featured-section">
        <div className="section-header flex-between mb-1">
          <h2 className="section-title">Active Challenges</h2>
          <Link to="/challenges" className="see-all">See all</Link>
        </div>
        
        <div className="challenges-grid grid grid-2 gap-1">
          {featuredChallenges.map(challenge => (
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

export default Home;