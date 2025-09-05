import React from 'react';
import { useApp } from '../../context/AppContext';

const UserStats = () => {
  const { state } = useApp();
  const { user } = state;
  const completedCount = user.completedLessons.length + user.completedChallenges.length;

  return (
    <div className="user-stats">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card p-4 bg-[#0f1730] rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#80A1C1] text-sm">Level</span>
            <span className="text-2xl">⭐</span>
          </div>
          <div className="text-3xl font-bold heading-gradient">{user.level}</div>
        </div>

        <div className="stat-card p-4 bg-[#0f1730] rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#80A1C1] text-sm">XP</span>
            <span className="text-2xl">✨</span>
          </div>
          <div className="text-3xl font-bold heading-gradient">{user.xp}</div>
        </div>

        <div className="stat-card p-4 bg-[#0f1730] rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#80A1C1] text-sm">Completed</span>
            <span className="text-2xl">📚</span>
          </div>
          <div className="text-3xl font-bold heading-gradient">{completedCount}</div>
        </div>

        <div className="stat-card p-4 bg-[#0f1730] rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#80A1C1] text-sm">FinCoins</span>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-3xl font-bold heading-gradient">{user.coins}</div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-[#0f1730] rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[#80A1C1] text-sm">Daily Streak</span>
          <span className="text-xl">🔥</span>
        </div>
        <div className="flex items-center">
          <div className="text-2xl font-bold heading-gradient mr-2">{user.streak}</div>
          <div className="text-[#80A1C1] text-sm">days</div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;