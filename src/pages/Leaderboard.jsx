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
    <div className="min-h-screen bg-[#01110A] p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-[#80A1C1] rounded-full -top-36 -left-36 opacity-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#F4E87C] rounded-full top-1/2 -right-48 opacity-10"></div>
      </div>

      <div className="relative z-10 mb-8 transition-all duration-700 ease-out">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F4E87C] to-[#80A1C1] bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-[#80A1C1] mt-2">Compete with other users and climb the ranks</p>
        <div className="flex items-center mt-4">
          <div className="h-1 w-12 bg-[#F4E87C] rounded-full mr-2"></div>
          <div className="h-1 w-6 bg-[#80A1C1] rounded-full mr-2"></div>
          <div className="h-1 w-3 bg-[#80A1C1] rounded-full"></div>
        </div>
      </div>

      {userRank && (
        <div className="relative z-10 mb-8 bg-[#0A1F14] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg transform transition-all duration-500 hover:scale-[1.02]">
          <h2 className="text-xl font-semibold text-[#F4E87C] mb-4">Your Rank</h2>
          <div className="grid grid-cols-4 p-4 bg-gradient-to-r from-[#1C3B2A] to-[#0A1F14] rounded-xl items-center md:grid-cols-2 md:gap-4">
            <span className="text-[#F4E87C] font-bold text-lg">#{userRank}</span>
            <span className="text-white font-medium">{user.name}</span>
            <span className="text-[#80A1C1]">Level {user.level}</span>
            <span className="text-[#F4E87C] font-bold">{user.xp} XP</span>
          </div>
        </div>
      )}

      <div className="relative z-10 bg-[#0A1F14] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg">
        <h2 className="text-xl font-semibold text-[#F4E87C] mb-4">Top Financiers</h2>
        <div className="grid grid-cols-4 p-4 font-semibold text-[#80A1C1] border-b border-[#1C3B2A] mb-4 md:grid-cols-2 md:gap-4">
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
                  ? 'bg-gradient-to-r from-[#1C3B2A] to-[#0A1F14] border-l-4 border-[#F4E87C] shadow-lg' 
                  : 'odd:bg-[#0C291C]'
              }`}
            >
              <span className={`font-bold ${entry.rank <= 3 ? 'text-[#F4E87C]' : 'text-white'}`}>#{entry.rank}</span>
              <span className="text-white">{entry.name}</span>
              <span className="text-[#80A1C1]">Level {entry.level}</span>
              <span className="text-[#F4E87C] font-semibold">{entry.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;