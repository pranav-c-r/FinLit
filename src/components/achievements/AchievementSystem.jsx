import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import AchievementNotification from './AchievementNotification';

const AchievementSystem = () => {
  const { state, dispatch } = useApp();
  const [showNotification, setShowNotification] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  
  // List of all possible achievements
  const achievements = [
    {
      id: 'first_lesson',
      title: 'First Steps',
      description: 'Complete your first financial lesson',
      icon: '📚',
      xpReward: 50,
      requirement: (user) => user.completedLessons?.length >= 1,
    },
    {
      id: 'saving_starter',
      title: 'Saving Starter',
      description: 'Save your first 100 FinCoins',
      icon: '💰',
      xpReward: 75,
      requirement: (user) => user.fincoins >= 100,
    },
    {
      id: 'streak_week',
      title: 'Consistency Champion',
      description: 'Maintain a 7-day login streak',
      icon: '🔥',
      xpReward: 100,
      requirement: (user) => user.streak >= 7,
    },
    {
      id: 'budget_master',
      title: 'Budget Master',
      description: 'Create your first monthly budget',
      icon: '📊',
      xpReward: 125,
      requirement: (user) => user.hasBudget,
    },
    {
      id: 'challenge_champion',
      title: 'Challenge Champion',
      description: 'Complete 5 financial challenges',
      icon: '🏆',
      xpReward: 150,
      requirement: (user) => user.completedChallenges?.length >= 5,
    },
    {
      id: 'goal_getter',
      title: 'Goal Getter',
      description: 'Achieve your first financial goal',
      icon: '🎯',
      xpReward: 200,
      requirement: (user) => user.completedGoals?.length >= 1,
    },
    {
      id: 'knowledge_seeker',
      title: 'Knowledge Seeker',
      description: 'Complete 10 financial lessons',
      icon: '🧠',
      xpReward: 250,
      requirement: (user) => user.completedLessons?.length >= 10,
    },
    {
      id: 'social_butterfly',
      title: 'Social Butterfly',
      description: 'Add 3 friends to your network',
      icon: '🦋',
      xpReward: 100,
      requirement: (user) => user.friends?.length >= 3,
    },
    {
      id: 'investment_guru',
      title: 'Investment Guru',
      description: 'Complete the investment module with a perfect score',
      icon: '📈',
      xpReward: 300,
      requirement: (user) => user.moduleScores?.investment === 100,
    },
    {
      id: 'finlit_master',
      title: 'FinLit Master',
      description: 'Reach level 10 in your financial journey',
      icon: '👑',
      xpReward: 500,
      requirement: (user) => user.level >= 10,
    },
  ];

  // Check for newly unlocked achievements
  useEffect(() => {
    if (!state.user) return;
    
    const unlockedAchievements = state.user.achievements || [];
    const newAchievements = achievements.filter(achievement => 
      !unlockedAchievements.includes(achievement.id) && 
      achievement.requirement(state.user)
    );
    
    if (newAchievements.length > 0) {
      // Get the first new achievement
      const achievement = newAchievements[0];
      
      // Update user's achievements and XP
      dispatch({
        type: 'UNLOCK_ACHIEVEMENT',
        payload: {
          achievementId: achievement.id,
          xpReward: achievement.xpReward
        }
      });
      
      // Show notification
      setCurrentAchievement(achievement);
      setShowNotification(true);
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  }, [state.user, dispatch]);

  // Get user's unlocked achievements
  const unlockedAchievements = state.user?.achievements || [];
  
  return (
    <div className="achievement-system">
      {/* Achievement list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          
          return (
            <div 
              key={achievement.id}
              className={`p-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${isUnlocked ? 'bg-[#0C291C] border border-[#1C3B2A]' : 'bg-[#0A1F14] opacity-70'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isUnlocked ? 'bg-gradient-to-br from-[#F4E87C] to-[#F9A826]' : 'bg-[#0C291C]'}`}>
                {achievement.icon}
              </div>
              <div className="flex-grow">
                <h3 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-[#80A1C1]'}`}>
                  {achievement.title}
                </h3>
                <p className="text-sm text-[#80A1C1]">{achievement.description}</p>
                {isUnlocked && (
                  <p className="text-xs text-[#F4E87C] mt-1">+{achievement.xpReward} XP</p>
                )}
              </div>
              {isUnlocked ? (
                <div className="text-[#F4E87C] text-xl">✓</div>
              ) : (
                <div className="text-[#80A1C1] text-xl">🔒</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Achievement notification */}
      {showNotification && currentAchievement && (
        <AchievementNotification 
          achievement={currentAchievement} 
          onClose={() => setShowNotification(false)} 
        />
      )}
    </div>
  );
};

export default AchievementSystem;