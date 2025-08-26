import React from 'react';
import { useApp } from '../context/AppContext';
import { leaderboard } from '../data/mockData';
import './Leaderboard.css';

const Leaderboard = () => {
  const { state } = useApp();
  const { user } = state;

  const getUserRank = () => {
    return leaderboard.find(entry => entry.name === user.name)?.rank || null;
  };

  const userRank = getUserRank();

  return (
    <div className="leaderboard-page">
      <div className="page-header">
        <h1>Leaderboard</h1>
        <p>Compete with other users and climb the ranks</p>
      </div>

      {userRank && (
        <div className="user-rank card mb-2">
          <h2 className="section-title">Your Rank</h2>
          <div className="rank-card highlighted">
            <span className="rank-number">#{userRank}</span>
            <span className="rank-name">{user.name}</span>
            <span className="rank-level">Level {user.level}</span>
            <span className="rank-xp">{user.xp} XP</span>
          </div>
        </div>
      )}

      <div className="leaderboard-list card">
        <h2 className="section-title">Top Financiers</h2>
        <div className="leaderboard-header grid grid-4">
          <span>Rank</span>
          <span>Name</span>
          <span>Level</span>
          <span>XP</span>
        </div>
        
        <div className="leaderboard-entries">
          {leaderboard.map(entry => (
            <div 
              key={entry.rank} 
              className={`leaderboard-entry grid grid-4 ${entry.name === user.name ? 'highlighted' : ''}`}
            >
              <span className="rank-number">#{entry.rank}</span>
              <span className="rank-name">{entry.name}</span>
              <span className="rank-level">Level {entry.level}</span>
              <span className="rank-xp">{entry.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;