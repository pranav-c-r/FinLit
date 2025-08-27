import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import ProgressChart from '../components/dashboard/ProgressChart';

const Profile = () => {
  const { state } = useApp();
  const { user } = state;
  const completedCount = user.completedLessons.length + user.completedChallenges.length;
  const statsRef = useRef(null);
  const achievementRefs = useRef([]);

  useEffect(() => {
    if (statsRef.current) {
      setTimeout(() => {
        statsRef.current.classList.remove('opacity-0', 'scale-95');
        statsRef.current.classList.add('opacity-100', 'scale-100');
      }, 100);
    }

    achievementRefs.current.forEach((ref, index) => {
      if (ref) {
        setTimeout(() => {
          ref.classList.remove('opacity-0', 'translate-y-10');
          ref.classList.add('opacity-100', 'translate-y-0');
        }, index * 150 + 300);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#01110A] p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-[#80A1C1] rounded-full -top-36 -left-36 opacity-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-[#F4E87C] rounded-full -bottom-48 -right-48 opacity-10"></div>
      </div>

      <div className="relative z-10 mb-8 transition-all duration-700 ease-out">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F4E87C] to-[#80A1C1] bg-clip-text text-transparent">
          Your Profile
        </h1>
        <p className="text-[#80A1C1] mt-2">Track your financial literacy journey</p>
        <div className="flex items-center mt-4">
          <div className="h-1 w-12 bg-[#F4E87C] rounded-full mr-2"></div>
          <div className="h-1 w-6 bg-[#80A1C1] rounded-full mr-2"></div>
          <div className="h-1 w-3 bg-[#80A1C1] rounded-full"></div>
        </div>
      </div>

      <div ref={statsRef} className="relative z-10 mb-8 bg-[#0A1F14] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg transition-all duration-500 opacity-0 scale-95">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white flex items-center justify-center text-5xl font-bold mb-4 shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h2 className="text-white text-2xl font-semibold mb-1">{user.name}</h2>
            <p className="text-[#80A1C1]">Financial Explorer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-[#0C291C] rounded-xl">
            <div className="text-4xl font-bold text-[#F4E87C] mb-1">{user.level}</div>
            <div className="text-[#80A1C1] text-sm">Level</div>
          </div>
          <div className="p-4 bg-[#0C291C] rounded-xl">
            <div className="text-4xl font-bold text-[#F4E87C] mb-1">{completedCount}</div>
            <div className="text-[#80A1C1] text-sm">Completed</div>
          </div>
          <div className="p-4 bg-[#0C291C] rounded-xl">
            <div className="text-4xl font-bold text-[#F4E87C] mb-1">{user.coins}</div>
            <div className="text-[#80A1C1] text-sm">FinCoins</div>
          </div>
        </div>
      </div>

      <div className="progress-section relative z-10 mb-8 bg-[#0A1F14] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg transform transition-all duration-500 hover:scale-[1.02]">
        <h2 className="text-xl font-semibold text-[#F4E87C] mb-4">Level Progress</h2>
        <ProgressChart 
          xp={user.xp} 
          nextLevelXp={user.nextLevelXp} 
        />
      </div>

      <div className="relative z-10 mb-8 bg-[#0A1F14] rounded-2xl p-6 border border-[#1C3B2A] shadow-lg">
        <h2 className="text-xl font-semibold text-[#F4E87C] mb-4">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            ref={el => achievementRefs.current[0] = el}
            className="flex items-center gap-4 p-4 bg-[#0C291C] rounded-xl transition-all duration-500 opacity-0 translate-y-10"
          >
            <div className="text-4xl">📚</div>
            <div className="achievement-info">
              <h3 className="text-[#F4E87C] text-lg font-semibold mb-1">Lesson Master</h3>
              <p className="text-[#80A1C1] text-sm">{user.completedLessons.length} of 5 lessons completed</p>
            </div>
          </div>
          <div 
            ref={el => achievementRefs.current[1] = el}
            className="flex items-center gap-4 p-4 bg-[#0C291C] rounded-xl transition-all duration-500 opacity-0 translate-y-10"
          >
            <div className="text-4xl">🎯</div>
            <div className="achievement-info">
              <h3 className="text-[#F4E87C] text-lg font-semibold mb-1">Challenge Champion</h3>
              <p className="text-[#80A1C1] text-sm">{user.completedChallenges.length} of 3 challenges completed</p>
            </div>
          </div>
          <div 
            ref={el => achievementRefs.current[2] = el}
            className="flex items-center gap-4 p-4 bg-[#0C291C] rounded-xl transition-all duration-500 opacity-0 translate-y-10"
          >
            <div className="text-4xl">🏆</div>
            <div className="achievement-info">
              <h3 className="text-[#F4E87C] text-lg font-semibold mb-1">Goal Getter</h3>
              <p className="text-[#80A1C1] text-sm">{user.goals.length} goals set</p>
            </div>
          </div>
          <div 
            ref={el => achievementRefs.current[3] = el}
            className="flex items-center gap-4 p-4 bg-[#0C291C] rounded-xl transition-all duration-500 opacity-0 translate-y-10"
          >
            <div className="text-4xl">⭐</div>
            <div className="achievement-info">
              <h3 className="text-[#F4E87C] text-lg font-semibold mb-1">FinLit Novice</h3>
              <p className="text-[#80A1C1] text-sm">Reach level 5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-8 flex-col md:flex-row relative z-10">
        <button className="bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          Edit Profile
        </button>
        <button className="bg-gradient-to-r from-[#F4E87C] to-[#D9C85B] text-[#01110A] px-6 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          Share Progress
        </button>
      </div>
    </div>
  );
};

export default Profile;