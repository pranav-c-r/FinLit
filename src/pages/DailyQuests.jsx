import React, { useState, useEffect } from 'react';
import DailyQuestsComponent from '../components/quests/DailyQuests';
import { motion, AnimatePresence } from 'framer-motion';

const DailyQuestsPage = () => {
  const [activeTab, setActiveTab] = useState('benefits');
  const [userStreak, setUserStreak] = useState(5); // Example: user has 5-day streak
  const [claimedRewards, setClaimedRewards] = useState([3]); // Example: user claimed 3-day reward
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [newlyCompleted, setNewlyCompleted] = useState([]);
  const [activeAchievement, setActiveAchievement] = useState(null);

  // Quest streak rewards
  const streakRewards = [
    { days: 3, reward: '100 Coins', icon: '🪙', claimed: true },
    { days: 7, reward: '300 Coins + Basic Avatar', icon: '👤', claimed: false },
    { days: 14, reward: '500 Coins + Rare Banner', icon: '🎯', claimed: false },
    { days: 30, reward: '1000 Coins + Legendary Theme', icon: '🏆', claimed: false },
    { days: 60, reward: '2000 Coins + Exclusive Title', icon: '👑', claimed: false },
  ];
  
  // Quest achievements
  const achievements = [
    { id: 1, name: 'Financial Novice', description: 'Complete your first 5 quests', reward: '200 XP', progress: 2, total: 5, icon: '🌱' },
    { id: 2, name: 'Budget Master', description: 'Complete 10 budget-related quests', reward: '500 XP', progress: 3, total: 10, icon: '📊' },
    { id: 3, name: 'Savings Champion', description: 'Save money for 30 consecutive days', reward: '1000 XP', progress: 12, total: 30, icon: '💰' },
    { id: 4, name: 'Investment Guru', description: 'Complete all investment education quests', reward: '1500 XP', progress: 1, total: 8, icon: '📈' },
  ];

  // Simulate quest completion
  const completeQuest = (questId) => {
    // This would typically come from your backend or context
    setNewlyCompleted([...newlyCompleted, questId]);
    setTimeout(() => setNewlyCompleted(newlyCompleted.filter(id => id !== questId)), 3000);
  };

  // Claim streak reward
  const claimReward = (days) => {
    if (!claimedRewards.includes(days) && userStreak >= days) {
      setClaimedRewards([...claimedRewards, days]);
      setShowStreakAnimation(true);
      setTimeout(() => setShowStreakAnimation(false), 2500);
    }
  };

  // Check for newly completed achievements
  useEffect(() => {
    achievements.forEach(achievement => {
      if (achievement.progress === achievement.total && !activeAchievement) {
        setActiveAchievement(achievement);
        setTimeout(() => setActiveAchievement(null), 3000);
      }
    });
  }, [achievements]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      {/* Achievement Celebration Modal */}
      <AnimatePresence>
        {activeAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl text-center max-w-md mx-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
              <div className="text-4xl mb-4">{activeAchievement.icon}</div>
              <h4 className="text-xl font-semibold text-white mb-2">{activeAchievement.name}</h4>
              <p className="text-blue-100 mb-4">{activeAchievement.description}</p>
              <div className="flex justify-center items-center space-x-4">
                <div className="flex items-center bg-blue-500/30 px-3 py-1 rounded-full">
                  <span className="text-yellow-400 mr-1">⭐</span>
                  <span className="text-white">+{activeAchievement.reward}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveAchievement(null)}
                className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-100 transition-colors"
              >
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streak Celebration Animation */}
      <AnimatePresence>
        {showStreakAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-2xl font-bold text-white mb-2">Streak Reward Claimed!</h3>
              <p className="text-blue-200">Keep your streak going for even better rewards!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Daily Quests
          </h1>
          <p className="text-blue-200">Complete daily challenges to boost your financial knowledge and earn rewards!</p>
          
          {/* Streak Counter */}
          <div className="inline-flex items-center bg-blue-500/20 px-4 py-2 rounded-full mt-4 border border-blue-400/30">
            <span className="text-yellow-400 mr-2 text-xl">🔥</span>
            <span className="text-white font-semibold">{userStreak} Day Streak</span>
            <div className="ml-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Daily Quests */}
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DailyQuestsComponent onQuestComplete={completeQuest} newlyCompleted={newlyCompleted} />
            </motion.div>
            
            {/* Streak Rewards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 p-6 bg-slate-800/80 rounded-xl border border-blue-500/30 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-bold text-blue-400 mb-4">🔥 Streak Rewards</h2>
              <p className="text-blue-200 mb-6">Maintain your daily quest streak to earn these special rewards!</p>
              
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 -translate-y-1/2 z-0"></div>
                <div className="flex justify-between relative z-10">
                  {streakRewards.map((reward, index) => {
                    const canClaim = userStreak >= reward.days && !claimedRewards.includes(reward.days);
                    const isClaimed = claimedRewards.includes(reward.days);
                    
                    return (
                      <motion.div 
                        key={index}
                        whileHover={{ scale: canClaim ? 1.15 : 1.05 }}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => canClaim && claimReward(reward.days)}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2 transition-all ${
                          isClaimed 
                            ? 'bg-green-500/20 border-2 border-green-400 shadow-lg shadow-green-400/20' 
                            : canClaim
                            ? 'bg-blue-500/20 border-2 border-blue-400 shadow-lg shadow-blue-400/20 animate-pulse'
                            : 'bg-slate-700/50 border border-slate-600'
                        }`}>
                          {reward.icon}
                          {isClaimed && (
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center">
                              <span className="text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <div className={`font-bold ${isClaimed ? 'text-green-400' : canClaim ? 'text-blue-400' : 'text-slate-400'}`}>
                            {reward.days} days
                          </div>
                          <div className="text-xs text-slate-300 mt-1">{reward.reward}</div>
                          {canClaim && (
                            <div className="text-xs text-blue-400 mt-1 animate-pulse">Click to claim!</div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-slate-800/80 rounded-xl border border-blue-500/30 backdrop-blur-sm"
            >
              <div className="flex mb-4 bg-slate-700 rounded-lg p-1">
                <button 
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'benefits' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('benefits')}
                >
                  Benefits
                </button>
                <button 
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'achievements' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('achievements')}
                >
                  Achievements
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                {activeTab === 'benefits' && (
                  <motion.div 
                    key="benefits"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <h2 className="text-xl font-bold text-blue-400 mb-4">Quest Benefits</h2>
                    
                    {[
                      { icon: '⭐', title: 'Earn XP', desc: 'Complete quests to earn XP and level up your financial profile.' },
                      { icon: '🪙', title: 'Collect Coins', desc: 'Earn virtual coins that can be used to unlock premium features.' },
                      { icon: '📚', title: 'Learn Skills', desc: 'Each quest teaches you valuable financial skills and habits.' },
                      { icon: '📊', title: 'Track Progress', desc: 'Monitor your financial journey and see how far you\'ve come.' }
                    ].map((benefit, index) => (
                      <motion.div 
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-slate-700/50 rounded-lg border border-blue-600/20 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{benefit.icon}</span>
                          <h3 className="font-semibold text-blue-300">{benefit.title}</h3>
                        </div>
                        <p className="text-slate-300 text-sm mt-2">{benefit.desc}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                
                {activeTab === 'achievements' && (
                  <motion.div 
                    key="achievements"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <h2 className="text-xl font-bold text-blue-400 mb-4">Achievements</h2>
                    
                    {achievements.map((achievement) => {
                      const progress = (achievement.progress / achievement.total) * 100;
                      const isCompleted = progress === 100;
                      
                      return (
                        <motion.div 
                          key={achievement.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-lg border cursor-pointer ${
                            isCompleted 
                              ? 'bg-green-500/10 border-green-500/30' 
                              : 'bg-slate-700/50 border-blue-600/20'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`text-2xl ${isCompleted ? 'text-green-400' : 'text-blue-400'}`}>
                              {achievement.icon}
                            </div>
                            <h3 className={`font-semibold ${isCompleted ? 'text-green-300' : 'text-blue-300'}`}>
                              {achievement.name}
                            </h3>
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{achievement.description}</p>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-400">Reward: {achievement.reward}</span>
                            <span className="text-xs font-medium text-blue-400">
                              {achievement.progress}/{achievement.total}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full rounded-full ${
                                isCompleted 
                                  ? 'bg-gradient-to-r from-green-500 to-green-700' 
                                  : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                          {isCompleted && (
                            <div className="text-xs text-green-400 mt-2 flex items-center">
                              <span className="mr-1">✓</span> Completed!
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Daily Tip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-400/30"
            >
              <h3 className="text-lg font-semibold text-blue-400 mb-2">💡 Daily Tip</h3>
              <p className="text-slate-300 text-sm">
                Complete at least one quest every day to maintain your streak and unlock special rewards!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuestsPage;