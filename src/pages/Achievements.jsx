import React from 'react';
import AchievementSystem from '../components/achievements/AchievementSystem';
import { useApp } from '../context/AppContext';

const Achievements = () => {
  const { state } = useApp();
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold heading-gradient mb-2">Achievements</h1>
        <p className="text-[#80A1C1]">
          Track your financial learning journey and earn rewards by unlocking achievements.
          Each achievement you earn will grant you XP and special titles to showcase on your profile!
        </p>
      </div>
      
      {/* User's achievement stats */}
      <div className="bg-[#0C291C] rounded-xl p-6 mb-8 border border-[#1C3B2A]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-[#80A1C1] text-sm">Achievements Unlocked</p>
            <p className="text-3xl font-bold heading-gradient">
              {state.user?.achievements?.length || 0} / 10
            </p>
          </div>
          <div className="text-center">
            <p className="text-[#80A1C1] text-sm">Total XP Earned</p>
            <p className="text-3xl font-bold heading-gradient">
              {state.user?.achievements?.reduce((total, id) => {
                const achievement = AchievementSystem().achievements?.find(a => a.id === id);
                return total + (achievement?.xpReward || 0);
              }, 0) || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[#80A1C1] text-sm">Rarest Achievement</p>
            <p className="text-xl font-bold text-[#F4E87C]">
              {state.user?.achievements?.includes('finlit_master') ? 'FinLit Master' : 
               state.user?.achievements?.includes('investment_guru') ? 'Investment Guru' : 
               'None Yet'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Achievement list */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold heading-gradient mb-4">Your Achievements</h2>
        <AchievementSystem />
      </div>
      
      {/* Achievement benefits */}
      <div className="bg-[#0C291C] rounded-xl p-6 border border-[#1C3B2A]">
        <h2 className="text-xl font-semibold heading-gradient mb-4">Benefits of Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 bg-[#0A1F14] rounded-lg">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="text-white font-medium mb-1">Earn XP</h3>
            <p className="text-[#80A1C1] text-sm">Each achievement grants XP to level up faster</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-[#0A1F14] rounded-lg">
            <div className="text-3xl mb-2">👑</div>
            <h3 className="text-white font-medium mb-1">Unlock Titles</h3>
            <p className="text-[#80A1C1] text-sm">Show off special titles on your profile</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-[#0A1F14] rounded-lg">
            <div className="text-3xl mb-2">🎁</div>
            <h3 className="text-white font-medium mb-1">Special Rewards</h3>
            <p className="text-[#80A1C1] text-sm">Some achievements unlock exclusive customizations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;