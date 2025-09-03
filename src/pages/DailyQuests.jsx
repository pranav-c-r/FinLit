import React, { useState } from 'react';
import DailyQuestsComponent from '../components/quests/DailyQuests';
import { motion } from 'framer-motion';

const DailyQuestsPage = () => {
  const [activeTab, setActiveTab] = useState('benefits');
  
  // Quest streak rewards
  const streakRewards = [
    { days: 3, reward: '100 Coins', icon: '🪙' },
    { days: 7, reward: '300 Coins + Basic Avatar', icon: '👤' },
    { days: 14, reward: '500 Coins + Rare Banner', icon: '🎯' },
    { days: 30, reward: '1000 Coins + Legendary Theme', icon: '🏆' },
    { days: 60, reward: '2000 Coins + Exclusive Title', icon: '👑' },
  ];
  
  // Quest achievements
  const achievements = [
    { id: 1, name: 'Financial Novice', description: 'Complete your first 5 quests', reward: '200 XP', progress: '2/5', icon: '🌱' },
    { id: 2, name: 'Budget Master', description: 'Complete 10 budget-related quests', reward: '500 XP', progress: '3/10', icon: '📊' },
    { id: 3, name: 'Savings Champion', description: 'Save money for 30 consecutive days', reward: '1000 XP', progress: '12/30', icon: '💰' },
    { id: 4, name: 'Investment Guru', description: 'Complete all investment education quests', reward: '1500 XP', progress: '1/8', icon: '📈' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <DailyQuestsComponent />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 p-6 bg-gradient-to-r from-tertiary/10 to-primary/10 rounded-xl border border-tertiary/20"
          >
            <h2 className="text-2xl font-bold gradient-text mb-4">Quest Streak Rewards</h2>
            <p className="text-gray-300 mb-4">Maintain your daily quest streak to earn these special rewards!</p>
            
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -translate-y-1/2 z-0"></div>
              <div className="flex justify-between relative z-10">
                {streakRewards.map((reward, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl mb-2">
                      {reward.icon}
                    </div>
                    <div className="text-center">
                      <div className="text-primary-light font-bold">{reward.days} days</div>
                      <div className="text-gray-300 text-xs">{reward.reward}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="lg:w-1/4">
          <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
            <div className="flex mb-4 bg-background-dark rounded-lg p-1">
              <button 
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'benefits' ? 'bg-primary text-white' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setActiveTab('benefits')}
              >
                Benefits
              </button>
              <button 
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'achievements' ? 'bg-primary text-white' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setActiveTab('achievements')}
              >
                Achievements
              </button>
            </div>
            
            {activeTab === 'benefits' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold gradient-text mb-4">Quest Benefits</h2>
                
                <div className="p-4 bg-background-dark/50 rounded-lg border border-accent/20">
                  <h3 className="text-lg font-semibold text-primary-light mb-2">Earn XP</h3>
                  <p className="text-gray-300 text-sm">Complete quests to earn XP and level up your financial profile.</p>
                </div>
                
                <div className="p-4 bg-background-dark/50 rounded-lg border border-accent/20">
                  <h3 className="text-lg font-semibold text-primary-light mb-2">Collect Coins</h3>
                  <p className="text-gray-300 text-sm">Earn virtual coins that can be used to unlock premium features and avatars.</p>
                </div>
                
                <div className="p-4 bg-background-dark/50 rounded-lg border border-accent/20">
                  <h3 className="text-lg font-semibold text-primary-light mb-2">Learn Skills</h3>
                  <p className="text-gray-300 text-sm">Each quest is designed to teach you valuable financial skills and habits.</p>
                </div>
                
                <div className="p-4 bg-background-dark/50 rounded-lg border border-accent/20">
                  <h3 className="text-lg font-semibold text-primary-light mb-2">Track Progress</h3>
                  <p className="text-gray-300 text-sm">Monitor your financial journey and see how far you've come.</p>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'achievements' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold gradient-text mb-4">Achievements</h2>
                
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 bg-background-dark/50 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">{achievement.icon}</div>
                      <h3 className="text-lg font-semibold text-primary-light">{achievement.name}</h3>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Reward: {achievement.reward}</span>
                      <span className="text-xs font-medium text-secondary-light">{achievement.progress}</span>
                    </div>
                    <div className="mt-2 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                        style={{ width: `${(parseInt(achievement.progress.split('/')[0]) / parseInt(achievement.progress.split('/')[1])) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuestsPage;