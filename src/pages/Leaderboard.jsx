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
          ref.classList.remove('opacity-0', 'translate-y-5');
          ref.classList.add('opacity-100', 'translate-y-0');
        }, index * 100);
      }
    });
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
      {/* Gamified background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-16 h-16 bg-yellow-400/20 rounded-lg rotate-12 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-12 h-12 bg-blue-400/20 rounded-lg -rotate-6 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-cyan-400/20 rounded-lg rotate-45 animate-ping-slow"></div>
        <div className="absolute bottom-10 right-1/4 w-14 h-14 bg-purple-400/20 rounded-lg -rotate-12 animate-pulse-slower"></div>
      </div>

      <div className="relative z-10 mb-8 transition-all duration-700 ease-out">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent">
          <span className="flex items-center">
            <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            Leaderboard
          </span>
        </h1>
        <p className="text-slate-300 mt-2">Compete with other users and climb the ranks</p>
        <div className="flex items-center mt-4">
          <div className="h-1 w-12 bg-yellow-400 rounded-full mr-2"></div>
          <div className="h-1 w-6 bg-cyan-400 rounded-full mr-2"></div>
          <div className="h-1 w-3 bg-purple-500 rounded-full"></div>
        </div>
      </div>

      {userRank && (
        <div className="relative z-10 mb-8 bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-400/30 shadow-lg shadow-cyan-400/10 transform transition-all duration-500 hover:scale-[1.02]">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
              Your Rank
            </span>
          </h2>
          <div className="grid grid-cols-4 p-4 bg-slate-700/50 rounded-xl border-l-4 border-yellow-400 items-center md:grid-cols-2 md:gap-4">
            <span className="text-yellow-400 font-bold text-lg">#{userRank}</span>
            <span className="text-white font-medium">{user.name}</span>
            <span className="text-slate-300">Level {user.level}</span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold">{user.xp} XP</span>
          </div>
        </div>
      )}

      <div className="relative z-10 bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-400/20 shadow-lg shadow-cyan-400/10">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          <span className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Top Financiers
          </span>
        </h2>
        
        {/* Header row */}
        <div className="grid grid-cols-4 p-4 font-semibold text-cyan-400 border-b border-cyan-400/20 mb-4 md:grid-cols-2 md:gap-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Rank
          </span>
          <span>Name</span>
          <span>Level</span>
          <span>XP</span>
        </div>
        
        {/* Leaderboard entries */}
        <div className="leaderboard-entries space-y-3">
          {leaderboard.map((entry, index) => (
            <div 
              key={entry.rank} 
              ref={el => entryRefs.current[index] = el}
              className={`grid grid-cols-4 p-4 rounded-xl items-center transition-all duration-500 opacity-0 translate-y-5 md:grid-cols-2 md:gap-4 ${
                entry.name === user.name 
                  ? 'bg-slate-700/70 border-l-4 border-yellow-400 shadow-lg shadow-yellow-400/10' 
                  : index % 2 === 0 ? 'bg-slate-700/40' : 'bg-slate-700/20'
              } ${entry.rank <= 3 ? 'ring-1 ring-opacity-20' : ''} ${
                entry.rank === 1 ? 'ring-yellow-400' : 
                entry.rank === 2 ? 'ring-slate-300' : 
                entry.rank === 3 ? 'ring-amber-600' : ''
              }`}
            >
              <span className={`font-bold flex items-center ${
                entry.rank === 1 ? 'text-yellow-400' : 
                entry.rank === 2 ? 'text-slate-300' : 
                entry.rank === 3 ? 'text-amber-500' : 'text-white'
              }`}>
                {entry.rank <= 3 && (
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                )}
                #{entry.rank}
              </span>
              <span className="text-white font-medium">{entry.name}</span>
              <span className="text-slate-300">Level {entry.level}</span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">{entry.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;