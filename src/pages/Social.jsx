import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import FriendRequests from '../components/social/FriendRequests';
import FriendsList from '../components/profile/FriendsList';
import SocialNotifications from '../components/social/SocialNotifications';

const Social = () => {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'requests', 'notifications', 'privacy'
  const { state } = useApp();
  
  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-primary-light/30 rounded-full -top-36 -left-36 animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-primary/20 rounded-full -bottom-48 -right-48 animate-float animate-delay-1000"></div>
        <div className="absolute w-64 h-64 bg-accent/25 rounded-full top-1/4 left-1/4 animate-pulse-slower animate-delay-2000"></div>
      </div>

      <div className="relative z-10 mb-8 transition-all duration-700 ease-out">
        <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
          Social
        </h1>
        <p className="text-[#80A1C1] mt-2">Connect with friends and share your financial journey</p>
        <div className="flex items-center mt-4">
          <div className="h-1 w-12 bg-[#F4E87C] rounded-full mr-2"></div>
          <div className="h-1 w-6 bg-[#80A1C1] rounded-full mr-2"></div>
          <div className="h-1 w-3 bg-[#80A1C1] rounded-full"></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1C3B2A] mb-6 relative z-10">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'friends' ? 'text-[#F4E87C] border-b-2 border-[#F4E87C]' : 'text-[#80A1C1] hover:text-white'}`}
          onClick={() => setActiveTab('friends')}
        >
          My Friends
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'requests' ? 'text-[#F4E87C] border-b-2 border-[#F4E87C]' : 'text-[#80A1C1] hover:text-white'}`}
          onClick={() => setActiveTab('requests')}
        >
          Friend Requests
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'notifications' ? 'text-[#F4E87C] border-b-2 border-[#F4E87C]' : 'text-[#80A1C1] hover:text-white'}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'privacy' ? 'text-[#F4E87C] border-b-2 border-[#F4E87C]' : 'text-[#80A1C1] hover:text-white'}`}
          onClick={() => setActiveTab('privacy')}
        >
          Privacy Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative z-10">
        {activeTab === 'friends' && (
          <div className="bg-gradient-to-br from-[#0A1F14] to-[#0C291C] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg">
            <h2 className="text-xl font-semibold heading-gradient mb-4">My Friends</h2>
            <FriendsList />
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-gradient-to-br from-[#0A1F14] to-[#0C291C] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg">
            <FriendRequests />
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="bg-gradient-to-br from-[#0A1F14] to-[#0C291C] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg">
            <h2 className="text-xl font-semibold heading-gradient mb-4">Notifications</h2>
            <SocialNotifications />
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="bg-gradient-to-br from-[#0A1F14] to-[#0C291C] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg">
            <h2 className="text-xl font-semibold heading-gradient mb-4">Privacy Settings</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-[#0C291C] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">Profile Visibility</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[#1C3B2A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#80A1C1]"></div>
                  </label>
                </div>
                <p className="text-sm text-[#80A1C1]">Allow other users to view your profile</p>
              </div>
              
              <div className="p-4 bg-[#0C291C] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">Progress Sharing</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[#1C3B2A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#80A1C1]"></div>
                  </label>
                </div>
                <p className="text-sm text-[#80A1C1]">Share your learning progress with friends</p>
              </div>
              
              <div className="p-4 bg-[#0C291C] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">Friend Requests</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[#1C3B2A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#80A1C1]"></div>
                  </label>
                </div>
                <p className="text-sm text-[#80A1C1]">Allow users to send you friend requests</p>
              </div>
              
              <div className="p-4 bg-[#0C291C] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">Leaderboard Participation</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-[#1C3B2A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#80A1C1]"></div>
                  </label>
                </div>
                <p className="text-sm text-[#80A1C1]">Show your name and progress on the leaderboard</p>
              </div>
              
              <button className="w-full py-3 bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
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