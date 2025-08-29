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
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Additional animated elements specific to Profile page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-primary-light/30 rounded-full -top-36 -left-36 animate-pulse-slow"></div>
        <div className="absolute w-96 h-96 bg-primary/20 rounded-full -bottom-48 -right-48 animate-float animate-delay-1000"></div>
        <div className="absolute w-64 h-64 bg-accent/25 rounded-full top-1/4 left-1/4 animate-pulse-slower animate-delay-2000"></div>
      </div>

      <div className="relative z-10 mb-8 transition-all duration-700 ease-out">
        <h1 className="text-3xl md:text-4xl font-bold heading-gradient">
          Your Profile
        </h1>
        <p className="text-[#80A1C1] mt-2">Track your financial literacy journey</p>
        <div className="flex items-center mt-4">
          <div className="h-1 w-12 bg-[#F4E87C] rounded-full mr-2"></div>
          <div className="h-1 w-6 bg-[#80A1C1] rounded-full mr-2"></div>
          <div className="h-1 w-3 bg-[#80A1C1] rounded-full"></div>
        </div>
      </div>

      <div ref={statsRef} className="relative z-10 mb-8 bg-gradient-to-br from-[#0A1F14] to-[#0C291C] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg transition-all duration-500 opacity-0 scale-95">
        <div className="flex flex-col items-center text-center mb-6">
          {user.avatar ? (
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 shadow-lg transform transition-all duration-300 hover:scale-105 border-2 border-[#1C3B2A]">
              <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white flex items-center justify-center text-5xl font-bold mb-4 shadow-lg transform transition-all duration-300 hover:scale-105">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="profile-info">
            <h2 className="heading-gradient text-2xl font-semibold mb-1">{user.name}</h2>
            <div className="flex items-center justify-center gap-2">
              <p className="text-[#80A1C1]">{user.activeTitle || "Financial Explorer"}</p>
            </div>
          </div>
        </div>

        <UserStats />
      </div>

      <div className="progress-section relative z-10 mb-8 bg-gradient-to-br from-[#0A1F14] to-[#0C291C] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg transform transition-all duration-500 hover:scale-[1.02]">
        <h2 className="text-xl font-semibold heading-gradient mb-4">Level Progress</h2>
        <ProgressChart 
          xp={user.xp} 
          nextLevelXp={user.nextLevelXp} 
        />
        <div className="mt-4 text-center">
          <p className="text-[#80A1C1]">{user.xp} / {user.nextLevelXp} XP to next level</p>
        </div>
      </div>
      
      {user.banner && (
        <div className="profile-banner relative z-10 mb-8 bg-gradient-to-br from-[#0A1F14] to-[#0C291C] rounded-2xl overflow-hidden border border-[#1C3B2A] shadow-lg transform transition-all duration-500 hover:scale-[1.01]">
          <img src={user.banner} alt="Profile Banner" className="w-full h-40 object-cover" />
          <div className="absolute bottom-4 left-4 bg-[#0A1F14]/80 px-3 py-1 rounded-lg">
            <p className="text-sm text-[#80A1C1]">Active Banner</p>
          </div>
        </div>
      )}

      <div className="relative z-10 mb-8 bg-gradient-to-br from-[#0A1F14] to-[#0C291C] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg transform transition-all duration-500 hover:scale-[1.01]">
        <h2 className="text-xl font-semibold heading-gradient mb-4">Your Achievements</h2>
        <AchievementsList />
      </div>

      <div className="relative z-10 mb-8 bg-gradient-to-br from-[#0A1F14] to-[#0C291C] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg transform transition-all duration-500 hover:scale-[1.01]">
        <h2 className="text-xl font-semibold heading-gradient mb-4">Friends</h2>
        <FriendsList />
      </div>

      <div className="flex justify-center gap-6 mt-8 flex-col md:flex-row relative z-10">
        <Link to="/rewards" className="bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl text-center">
          Customize Profile
        </Link>
        <button className="bg-gradient-to-r from-[#F4E87C] to-[#D9C85B] text-[#01110A] px-6 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          Share Progress
        </button>
      </div>
    </div>
  );
};

export default Profile;