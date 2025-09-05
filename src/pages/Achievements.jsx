import React from 'react';
import AchievementSystem from '../components/achievements/AchievementSystem';
import { useApp } from '../context/AppContext';

const Achievements = () => {
  const { state } = useApp();
  
  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          <span className="flex items-center">
            <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Achievements
          </span>
        </h1>
        <p className="text-slate-300">
          Track your financial learning journey and earn rewards by unlocking achievements.
          Each achievement you earn will grant you XP and special titles to showcase on your profile!
        </p>
      </div>
      
      {/* User's achievement stats */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-emerald-400/30 shadow-lg shadow-emerald-400/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-blue-800/20">
            <div className="flex justify-center mb-2">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <p className="text-slate-400 text-sm mb-1">Achievements Unlocked</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {state.user?.achievements?.length || 0} / 10
            </p>
          </div>
          <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-blue-800/20">
            <div className="flex justify-center mb-2">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <p className="text-slate-400 text-sm mb-1">Total XP Earned</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {state.user?.achievements?.reduce((total, id) => {
                const achievement = AchievementSystem().achievements?.find(a => a.id === id);
                return total + (achievement?.xpReward || 0);
              }, 0) || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-slate-700/50 rounded-lg border border-blue-800/20">
            <div className="flex justify-center mb-2">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <p className="text-slate-400 text-sm mb-1">Rarest Achievement</p>
            <p className="text-xl font-bold text-amber-400">
              {state.user?.achievements?.includes('finlit_master') ? 'FinLit Master' : 
               state.user?.achievements?.includes('investment_guru') ? 'Investment Guru' : 
               'None Yet'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Achievement list */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          <span className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Your Achievements
          </span>
        </h2>
        <AchievementSystem />
      </div>
      
      {/* Achievement benefits */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/30 shadow-lg shadow-emerald-400/10">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6">
          <span className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Benefits of Achievements
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 bg-slate-700/50 rounded-lg border border-blue-800/20 transform transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-blue-800/20 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <h3 className="text-white font-medium mb-1">Earn XP</h3>
            <p className="text-slate-300 text-sm">Each achievement grants XP to level up faster</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-slate-700/50 rounded-lg border border-blue-800/20 transform transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-amber-400/20 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <h3 className="text-white font-medium mb-1">Unlock Titles</h3>
            <p className="text-slate-300 text-sm">Show off special titles on your profile</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-slate-700/50 rounded-lg border border-blue-800/20 transform transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
              </svg>
            </div>
            <h3 className="text-white font-medium mb-1">Special Rewards</h3>
            <p className="text-slate-300 text-sm">Some achievements unlock exclusive customizations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;