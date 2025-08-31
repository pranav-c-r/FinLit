// Rewards data for the FinLit app
export const rewardsData = {
  avatars: [
    {
      id: 'default',
      name: 'Default Avatar',
      emoji: '👤',
      rarity: 'common',
      cost: 0,
      unlocked: true,
      unlockRequirement: 'Available from start'
    },
    {
      id: 'student',
      name: 'Student',
      emoji: '🎓',
      rarity: 'common',
      cost: 100,
      unlocked: false,
      unlockRequirement: 'Complete 3 lessons'
    },
    {
      id: 'investor',
      name: 'Investor',
      emoji: '📈',
      rarity: 'common',
      cost: 200,
      unlocked: false,
      unlockRequirement: 'Complete 5 lessons'
    },
    {
      id: 'savings',
      name: 'Savings Master',
      emoji: '💰',
      rarity: 'rare',
      cost: 500,
      unlocked: false,
      unlockRequirement: 'Complete 10 lessons'
    },
    {
      id: 'budget',
      name: 'Budget Boss',
      emoji: '📊',
      rarity: 'rare',
      cost: 750,
      unlocked: false,
      unlockRequirement: 'Maintain 7-day streak'
    },
    {
      id: 'entrepreneur',
      name: 'Entrepreneur',
      emoji: '🚀',
      rarity: 'epic',
      cost: 1000,
      unlocked: false,
      unlockRequirement: 'Complete 20 lessons'
    },
    {
      id: 'financial-guru',
      name: 'Financial Guru',
      emoji: '🧠',
      rarity: 'epic',
      cost: 1500,
      unlocked: false,
      unlockRequirement: 'Complete 30 lessons'
    },
    {
      id: 'millionaire',
      name: 'Future Millionaire',
      emoji: '👑',
      rarity: 'legendary',
      cost: 2500,
      unlocked: false,
      unlockRequirement: 'Complete 50 lessons'
    }
  ],

  banners: [
    {
      id: 'default',
      name: 'Default Banner',
      image: '/banners/default.jpg',
      rarity: 'common',
      cost: 0,
      unlocked: true,
      unlockRequirement: 'Available from start'
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      image: '/banners/ocean.jpg',
      rarity: 'common',
      cost: 150,
      unlocked: false,
      unlockRequirement: 'Reach Level 3'
    },
    {
      id: 'forest',
      name: 'Forest Path',
      image: '/banners/forest.jpg',
      rarity: 'rare',
      cost: 300,
      unlocked: false,
      unlockRequirement: 'Reach Level 5'
    },
    {
      id: 'mountain',
      name: 'Mountain Peak',
      image: '/banners/mountain.jpg',
      rarity: 'rare',
      cost: 500,
      unlocked: false,
      unlockRequirement: 'Maintain 14-day streak'
    },
    {
      id: 'galaxy',
      name: 'Galaxy',
      image: '/banners/galaxy.jpg',
      rarity: 'epic',
      cost: 800,
      unlocked: false,
      unlockRequirement: 'Reach Level 10'
    },
    {
      id: 'golden',
      name: 'Golden',
      image: '/banners/golden.jpg',
      rarity: 'legendary',
      cost: 1500,
      unlocked: false,
      unlockRequirement: 'Complete 100 lessons'
    }
  ],

  themes: [
    {
      id: 'default',
      name: 'Default Theme',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      backgroundColor: '#0F172A',
      rarity: 'common',
      cost: 0,
      unlocked: true,
      unlockRequirement: 'Available from start'
    },
    {
      id: 'ocean',
      name: 'Ocean Blue',
      primaryColor: '#0EA5E9',
      secondaryColor: '#06B6D4',
      backgroundColor: '#0C4A6E',
      rarity: 'common',
      cost: 200,
      unlocked: false,
      unlockRequirement: 'Reach Level 3'
    },
    {
      id: 'forest',
      name: 'Forest Green',
      primaryColor: '#059669',
      secondaryColor: '#10B981',
      backgroundColor: '#064E3B',
      rarity: 'rare',
      cost: 400,
      unlocked: false,
      unlockRequirement: 'Reach Level 7'
    },
    {
      id: 'sunset',
      name: 'Sunset',
      primaryColor: '#F59E0B',
      secondaryColor: '#EF4444',
      backgroundColor: '#7C2D12',
      rarity: 'rare',
      cost: 600,
      unlocked: false,
      unlockRequirement: 'Maintain 21-day streak'
    },
    {
      id: 'purple',
      name: 'Royal Purple',
      primaryColor: '#8B5CF6',
      secondaryColor: '#A855F7',
      backgroundColor: '#581C87',
      rarity: 'epic',
      cost: 1000,
      unlocked: false,
      unlockRequirement: 'Reach Level 15'
    },
    {
      id: 'golden',
      name: 'Golden',
      primaryColor: '#FCD34D',
      secondaryColor: '#F59E0B',
      backgroundColor: '#92400E',
      rarity: 'legendary',
      cost: 2000,
      unlocked: false,
      unlockRequirement: 'Complete 75 lessons'
    }
  ],

  titles: [
    {
      id: 'beginner',
      name: 'Financial Beginner',
      rarity: 'common',
      unlocked: true,
      unlockRequirement: 'Available from start'
    },
    {
      id: 'student',
      name: 'Financial Student',
      rarity: 'common',
      unlocked: false,
      unlockRequirement: 'Complete 5 lessons'
    },
    {
      id: 'learner',
      name: 'Active Learner',
      rarity: 'common',
      unlocked: false,
      unlockRequirement: 'Complete 10 lessons'
    },
    {
      id: 'savings',
      name: 'Savings Samurai',
      rarity: 'rare',
      unlocked: false,
      unlockRequirement: 'Save money for 7 consecutive days'
    },
    {
      id: 'budget',
      name: 'Budget Boss',
      rarity: 'rare',
      unlocked: false,
      unlockRequirement: 'Stay under budget for 14 days'
    },
    {
      id: 'investor',
      name: 'Investment Explorer',
      rarity: 'rare',
      unlocked: false,
      unlockRequirement: 'Complete 15 investment lessons'
    },
    {
      id: 'streak',
      name: 'Streak Master',
      rarity: 'epic',
      unlocked: false,
      unlockRequirement: 'Maintain 30-day login streak'
    },
    {
      id: 'challenger',
      name: 'Challenge Champion',
      rarity: 'epic',
      unlocked: false,
      unlockRequirement: 'Complete 20 challenges'
    },
    {
      id: 'guru',
      name: 'Financial Guru',
      rarity: 'epic',
      unlocked: false,
      unlockRequirement: 'Reach Level 20'
    },
    {
      id: 'legend',
      name: 'Financial Legend',
      rarity: 'legendary',
      unlocked: false,
      unlockRequirement: 'Complete 100 lessons and reach Level 25'
    }
  ]
};

// Helper function to get unlocked items based on user progress
export const getUnlockedItems = (userProgress) => {
  const { level, xp, streak, completedLessons, completedChallenges, goals } = userProgress;
  
  return {
    avatars: rewardsData.avatars.map(avatar => ({
      ...avatar,
      unlocked: avatar.unlocked || 
        (avatar.id === 'student' && completedLessons >= 3) ||
        (avatar.id === 'investor' && completedLessons >= 5) ||
        (avatar.id === 'savings' && completedLessons >= 10) ||
        (avatar.id === 'budget' && streak >= 7) ||
        (avatar.id === 'entrepreneur' && completedLessons >= 20) ||
        (avatar.id === 'financial-guru' && completedLessons >= 30) ||
        (avatar.id === 'millionaire' && completedLessons >= 50)
    })),
    
    banners: rewardsData.banners.map(banner => ({
      ...banner,
      unlocked: banner.unlocked ||
        (banner.id === 'ocean' && level >= 3) ||
        (banner.id === 'forest' && level >= 5) ||
        (banner.id === 'mountain' && streak >= 14) ||
        (banner.id === 'galaxy' && level >= 10) ||
        (banner.id === 'golden' && completedLessons >= 100)
    })),
    
    themes: rewardsData.themes.map(theme => ({
      ...theme,
      unlocked: theme.unlocked ||
        (theme.id === 'ocean' && level >= 3) ||
        (theme.id === 'forest' && level >= 7) ||
        (theme.id === 'sunset' && streak >= 21) ||
        (theme.id === 'purple' && level >= 15) ||
        (theme.id === 'golden' && completedLessons >= 75)
    })),
    
    titles: rewardsData.titles.map(title => ({
      ...title,
      unlocked: title.unlocked ||
        (title.id === 'student' && completedLessons >= 5) ||
        (title.id === 'learner' && completedLessons >= 10) ||
        (title.id === 'savings' && streak >= 7) ||
        (title.id === 'budget' && streak >= 14) ||
        (title.id === 'investor' && completedLessons >= 15) ||
        (title.id === 'streak' && streak >= 30) ||
        (title.id === 'challenger' && completedChallenges >= 20) ||
        (title.id === 'guru' && level >= 20) ||
        (title.id === 'legend' && completedLessons >= 100 && level >= 25)
    }))
  };
};
