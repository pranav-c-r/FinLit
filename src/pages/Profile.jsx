import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import ProgressChart from '../components/dashboard/ProgressChart';
import FriendsList from '../components/profile/FriendsList';
import UserStats from '../components/profile/UserStats';
import AchievementsList from '../components/profile/AchievementsList';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { state } = useApp();
  const { user } = state;
  const statsRef = useRef(null);

  useEffect(() => {
    if (statsRef.current) {
      setTimeout(() => {
        statsRef.current.classList.remove('opacity-0', 'scale-95');
        statsRef.current.classList.add('opacity-100', 'scale-100');
      }, 100);
    }
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Your Profile
          </span>
        </h1>
        <p className="text-slate-300 mt-2">Track your financial literacy journey</p>
        <div className="flex items-center mt-4">
          <div className="h-1 w-12 bg-yellow-400 rounded-full mr-2"></div>
          <div className="h-1 w-6 bg-cyan-400 rounded-full mr-2"></div>
          <div className="h-1 w-3 bg-purple-500 rounded-full"></div>
        </div>
      </div>

      <div ref={statsRef} className="relative z-10 mb-8 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/30 shadow-lg shadow-cyan-400/10 transition-all duration-500 opacity-0 scale-95">
        <div className="flex flex-col items-center text-center mb-6">
          {user.avatar ? (
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-lg transform transition-all duration-300 hover:scale-105 border-2 border-cyan-400/50">
              <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white flex items-center justify-center text-5xl font-bold mb-4 shadow-lg transform transition-all duration-300 hover:scale-105">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="profile-info">
            <h2 className="bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent text-2xl font-semibold mb-1">{user.name}</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {user.activeTitle || "Financial Explorer"}
              </span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                Level {user.level}
              </span>
            </div>
          </div>
        </div>

        <UserStats />
      </div>

      <div className="progress-section relative z-10 mb-8 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20 shadow-lg shadow-cyan-400/10 transform transition-all duration-500 hover:scale-[1.02]">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Level Progress
          </span>
        </h2>
        <ProgressChart 
          xp={user.xp} 
          nextLevelXp={user.nextLevelXp} 
        />
        <div className="mt-4 text-center">
          <p className="text-slate-300">{user.xp} / {user.nextLevelXp} XP to next level</p>
        </div>
      </div>
      
      {user.banner && (
        <div className="profile-banner relative z-10 mb-8 bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-cyan-400/20 shadow-lg shadow-cyan-400/10 transform transition-all duration-500 hover:scale-[1.01]">
          <img src={user.banner} alt="Profile Banner" className="w-full h-40 object-cover" />
          <div className="absolute bottom-4 left-4 bg-slate-900/80 px-3 py-1 rounded-lg">
            <p className="text-sm text-cyan-400">Active Banner</p>
          </div>
        </div>
      )}

      <div className="relative z-10 mb-8 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20 shadow-lg shadow-cyan-400/10 transform transition-all duration-500 hover:scale-[1.01]">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Your Achievements
          </span>
        </h2>
        <AchievementsList />
      </div>

      <div className="relative z-10 mb-8 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20 shadow-lg shadow-cyan-400/10 transform transition-all duration-500 hover:scale-[1.01]">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Friends
          </span>
        </h2>
        <FriendsList />
      </div>

      <div className="flex justify-center gap-6 mt-8 flex-col md:flex-row relative z-10">
        <Link to="/rewards" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-cyan-500/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl text-center flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Customize Profile
        </Link>
        <button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-yellow-400/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
          </svg>
          Share Progress
        </button>
      </div>
    </div>
  );
};

export default Profile;