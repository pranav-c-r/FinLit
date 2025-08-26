import React from 'react';
import { useApp } from '../context/AppContext';
import { leaderboard } from '../data/mockData';


const Leaderboard = () => {
  const { state } = useApp();
  const { user } = state;

  const getUserRank = () => {
    return leaderboard.find(entry => entry.name === user.name)?.rank || null;
  };

  const userRank = getUserRank();

  return (
    <div className="p-4 md:p-8">
      <div className="page-header">
        <h1>Leaderboard</h1>
        <p>Compete with other users and climb the ranks</p>
      </div>

      {userRank && (
        <div className="card mb-8">
          <h2 className="section-title">Your Rank</h2>
          <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 p-4 bg-white rounded-lg border-l-4 border-duolingo-green bg-duolingo-green-light-transparent md:grid-cols-1 md:text-center md:gap-2">
            <span className="text-gray-700 font-semibold">#{userRank}</span>
            <span className="rank-name">{user.name}</span>
            <span className="text-duolingo-light-green">Level {user.level}</span>
            <span className="text-duolingo-green">{user.xp} XP</span>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="section-title">Top Financiers</h2>
        <div className="grid grid-cols-4 p-4 font-semibold text-duolingo-green border-b border-gray-700 mb-2 md:grid-cols-2 md:grid-rows-2 md:gap-2">
          <span>Rank</span>
          <span>Name</span>
          <span>Level</span>
          <span>XP</span>
        </div>
        
        <div className="leaderboard-entries">
          {leaderboard.map(entry => (
            <div 
              key={entry.rank} 
              className={`grid grid-cols-4 p-4 rounded-md mb-2 items-center md:grid-cols-2 md:grid-rows-2 md:gap-2 ${entry.name === user.name ? 'bg-duolingo-green-light-transparent border-l-4 border-duolingo-green' : 'odd:bg-gray-100'}`}
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