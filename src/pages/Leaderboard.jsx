import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { leaderboard } from '../data/mockData';

const Leaderboard = () => {
  const { state } = useApp();
  const { user } = state;
  const userRank = leaderboard.find(entry => entry.name === user.name)?.rank || null;
  const entryRefs = useRef([]);

  useEffect(() => {
    entryRefs.current.forEach((ref, index) => {
      if (ref) {
        setTimeout(() => {
          ref.classList.remove('opacity-0', 'translate-x-10');
          ref.classList.add('opacity-100', 'translate-x-0');
        }, index * 100);
      }
    });
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Additional animated elements specific to Leaderboard page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-primary-light/30 rounded-full -top-36 -left-36 animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-primary/20 rounded-full top-1/2 -right-48 animate-float animate-delay-1000"></div>
        <div className="absolute w-64 h-64 bg-accent/25 rounded-full bottom-1/4 left-1/3 animate-pulse-slower animate-delay-2000"></div>
      </div>

      <div className="relative z-10 mb-8 transition-all duration-700 ease-out">
        <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
          Leaderboard
        </h1>
        <p className="text-gray-300 mt-2">Compete with other users and climb the ranks</p>
        <div className="flex items-center mt-4">
          <div className="h-1 w-12 bg-gradient-to-r from-primary-light to-primary rounded-full mr-2"></div>
          <div className="h-1 w-6 bg-primary-light/70 rounded-full mr-2"></div>
          <div className="h-1 w-3 bg-primary-light/50 rounded-full"></div>
        </div>
      </div>

      {userRank && (
        <div className="relative z-10 mb-8 card transform transition-all duration-500 hover:scale-[1.02]">
          <h2 className="text-xl font-semibold gradient-text mb-4">Your Rank</h2>
          <div className="grid grid-cols-4 p-4 bg-background-dark border-l-4 border-accent rounded-xl items-center md:grid-cols-2 md:gap-4">
            <span className="text-accent font-bold text-lg">#{userRank}</span>
            <span className="text-white font-medium">{user.name}</span>
            <span className="text-gray-300">Level {user.level}</span>
            <span className="gradient-text font-bold">{user.xp} XP</span>
          </div>
        </div>
      )}

      <div className="relative z-10 card">
        <h2 className="text-xl font-semibold gradient-text mb-4">Top Financiers</h2>
        <div className="grid grid-cols-4 p-4 font-semibold text-primary-light border-b border-primary/20 mb-4 md:grid-cols-2 md:gap-4">
          <span>Rank</span>
          <span>Name</span>
          <span>Level</span>
          <span>XP</span>
        </div>
        
        <div className="leaderboard-entries">
          {leaderboard.map((entry, index) => (
            <div 
              key={entry.rank} 
              ref={el => entryRefs.current[index] = el}
              className={`grid grid-cols-4 p-4 rounded-xl mb-3 items-center transition-all duration-500 opacity-0 translate-x-10 md:grid-cols-2 md:gap-4 ${
                entry.name === user.name 
                  ? 'bg-background-dark border-l-4 border-accent shadow-lg' 
                  : 'odd:bg-background-light'
              }`}
            >
              <span className={`font-bold ${entry.rank <= 3 ? 'text-accent' : 'text-white'}`}>#{entry.rank}</span>
              <span className="text-white">{entry.name}</span>
              <span className="text-gray-300">Level {entry.level}</span>
              <span className="gradient-text font-semibold">{entry.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;