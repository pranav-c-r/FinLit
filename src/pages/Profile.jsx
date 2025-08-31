import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import ProgressChart from '../components/dashboard/ProgressChart';
import FriendsList from '../components/profile/FriendsList';
import UserStats from '../components/profile/UserStats';
import AchievementsList from '../components/profile/AchievementsList';
import { Link } from 'react-router-dom';
import { getUnlockedItems } from '../data/rewards';

const Profile = () => {
  const { state, dispatch } = useApp();
  const { user } = state;
  const statsRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (statsRef.current) {
      setTimeout(() => {
        statsRef.current.classList.remove('opacity-0', 'scale-95');
        statsRef.current.classList.add('opacity-100', 'scale-100');
      }, 100);
    }
  }, []);

  const unlockedItems = getUnlockedItems(user);
  const totalAchievements = unlockedItems.titles.length;
  const totalRewards = unlockedItems.avatars.length + unlockedItems.banners.length + unlockedItems.themes.length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* User Stats */}
            <div ref={statsRef} className="relative z-10 mb-8 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/30 shadow-lg shadow-cyan-400/10 transition-all duration-500 opacity-0 scale-95">
              <div className="flex flex-col items-center text-center mb-6">
                {user.avatar ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-lg transform transition-all duration-300 hover:scale-105 border-2 border-cyan-400/50">
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      {user.avatar}
                    </div>
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

            {/* Level Progress */}
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

            {/* Profile Banner */}
            {user.banner && (
              <div className="profile-banner relative z-10 mb-8 bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-cyan-400/20 shadow-lg shadow-cyan-400/10 transform transition-all duration-500 hover:scale-[1.01]">
                <div className="w-full h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">🎨</div>
                    <p className="text-lg font-semibold">Custom Banner</p>
                    <p className="text-sm opacity-80">Personalize your profile</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-slate-900/80 px-3 py-1 rounded-lg">
                  <p className="text-sm text-cyan-400">Active Banner</p>
                </div>
              </div>
            )}

            {/* Achievements */}
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

            {/* Friends */}
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
          </div>
        );

      case 'rewards':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Your Rewards Collection</h2>
              <p className="text-gray-300">Track your unlocked items and progress</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
                <div className="text-2xl text-blue-400 mb-2">👤</div>
                <div className="text-2xl font-bold text-white">{unlockedItems.avatars.filter(a => a.unlocked).length}</div>
                <div className="text-sm text-gray-300">Avatars Unlocked</div>
              </div>
              <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
                <div className="text-2xl text-purple-400 mb-2">🎨</div>
                <div className="text-2xl font-bold text-white">{unlockedItems.banners.filter(b => b.unlocked).length}</div>
                <div className="text-sm text-gray-300">Banners Unlocked</div>
              </div>
              <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
                <div className="text-2xl text-green-400 mb-2">🎭</div>
                <div className="text-2xl font-bold text-white">{unlockedItems.themes.filter(t => t.unlocked).length}</div>
                <div className="text-sm text-gray-300">Themes Unlocked</div>
              </div>
            </div>

            <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Unlocks</h3>
              <div className="space-y-3">
                {unlockedItems.avatars.filter(a => a.unlocked).slice(-3).map(avatar => (
                  <div key={avatar.id} className="flex items-center space-x-3 p-3 bg-background-light/20 rounded-lg">
                    <div className="text-2xl">{avatar.emoji}</div>
                    <div>
                      <p className="text-white font-medium">{avatar.name}</p>
                      <p className="text-gray-400 text-sm">{avatar.unlockRequirement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Detailed Statistics</h2>
              <p className="text-gray-300">Your comprehensive financial learning journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
                <h3 className="text-lg font-semibold text-white mb-4">Learning Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Lessons Completed:</span>
                    <span className="text-white font-medium">{user.completedLessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Challenges Completed:</span>
                    <span className="text-white font-medium">{user.completedChallenges.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Current Streak:</span>
                    <span className="text-white font-medium">{user.streak} days</span>
                  </div>
                </div>
              </div>

              <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
                <h3 className="text-lg font-semibold text-white mb-4">Rewards & Achievements</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total XP Earned:</span>
                    <span className="text-white font-medium">{user.xp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Coins Collected:</span>
                    <span className="text-white font-medium">{user.coins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Titles Unlocked:</span>
                    <span className="text-white font-medium">{user.titles.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-background-dark rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: '👤' },
            { id: 'rewards', label: 'Rewards', icon: '🏆' },
            { id: 'stats', label: 'Statistics', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

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