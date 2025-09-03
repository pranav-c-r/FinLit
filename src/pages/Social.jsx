import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import FriendRequests from '../components/social/FriendRequests';
import FriendsList from '../components/profile/FriendsList';
import SocialNotifications from '../components/social/SocialNotifications';

const Social = () => {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'requests', 'notifications', 'privacy'
  const { state } = useApp();
  
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
          Social Hub
        </h1>
        <p className="text-slate-300 mt-2">Connect with friends and level up your financial journey</p>
        <div className="flex items-center mt-4">
          <div className="h-1 w-12 bg-yellow-400 rounded-full mr-2"></div>
          <div className="h-1 w-6 bg-cyan-400 rounded-full mr-2"></div>
          <div className="h-1 w-3 bg-purple-500 rounded-full"></div>
        </div>
      </div>

      {/* Gamified Tabs */}
      <div className="flex mb-6 relative z-10 gap-2">
        <button
          className={`px-6 py-3 font-medium rounded-t-xl transition-all duration-300 ${activeTab === 'friends' ? 'bg-slate-800 text-yellow-400 border-t-2 border-x-2 border-cyan-400/30' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70 hover:text-white'}`}
          onClick={() => setActiveTab('friends')}
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            My Friends
          </span>
        </button>
        <button
          className={`px-6 py-3 font-medium rounded-t-xl transition-all duration-300 ${activeTab === 'requests' ? 'bg-slate-800 text-yellow-400 border-t-2 border-x-2 border-cyan-400/30' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70 hover:text-white'}`}
          onClick={() => setActiveTab('requests')}
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            Friend Requests
          </span>
        </button>
        <button
          className={`px-6 py-3 font-medium rounded-t-xl transition-all duration-300 ${activeTab === 'notifications' ? 'bg-slate-800 text-yellow-400 border-t-2 border-x-2 border-cyan-400/30' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70 hover:text-white'}`}
          onClick={() => setActiveTab('notifications')}
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            Notifications
          </span>
        </button>
        <button
          className={`px-6 py-3 font-medium rounded-t-xl transition-all duration-300 ${activeTab === 'privacy' ? 'bg-slate-800 text-yellow-400 border-t-2 border-x-2 border-cyan-400/30' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/70 hover:text-white'}`}
          onClick={() => setActiveTab('privacy')}
        >
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Privacy
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative z-10">
        {activeTab === 'friends' && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20 shadow-lg shadow-cyan-400/10">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              <span className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                My Friends
              </span>
            </h2>
            <FriendsList />
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20 shadow-lg shadow-cyan-400/10">
            <FriendRequests />
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20 shadow-lg shadow-cyan-400/10">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              <span className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                Notifications
              </span>
            </h2>
            <SocialNotifications />
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/20 shadow-lg shadow-cyan-400/10">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              <span className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Privacy Settings
              </span>
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">Profile Visibility</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-300">Allow other users to view your profile</p>
              </div>
              
              <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">Progress Sharing</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-300">Share your learning progress with friends</p>
              </div>
              
              <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">Friend Requests</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-300">Allow users to send you friend requests</p>
              </div>
              
              <div className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">Leaderboard Participation</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
                <p className="text-sm text-slate-300">Show your name and progress on the leaderboard</p>
              </div>
              
              <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20">
                Save Privacy Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Social;