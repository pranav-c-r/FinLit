import React from 'react';
import RewardSystem from '../components/rewards/RewardSystem';

const Rewards = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Rewards & Customization</h1>
        <p className="text-gray-300">Unlock avatars, banners, themes, and titles as you progress!</p>
      </div>
      
      <div className="game-panel p-6">
        <RewardSystem />
      </div>
      
      <div className="game-card p-6 space-y-4">
        <h2 className="text-xl font-semibold gradient-text-secondary">How to Earn Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30">
            <h3 className="text-lg font-medium text-primary-light">Complete Lessons</h3>
            <p className="text-sm text-gray-300">Finish financial lessons to earn XP and unlock new avatars</p>
          </div>
          <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30">
            <h3 className="text-lg font-medium text-secondary-light">Daily Streaks</h3>
            <p className="text-sm text-gray-300">Maintain login streaks to earn exclusive banners</p>
          </div>
          <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30">
            <h3 className="text-lg font-medium text-tertiary-light">Achieve Goals</h3>
            <p className="text-sm text-gray-300">Complete financial goals to unlock special themes</p>
          </div>
          <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30">
            <h3 className="text-lg font-medium text-primary-light">Win Challenges</h3>
            <p className="text-sm text-gray-300">Beat financial challenges to earn prestigious titles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;