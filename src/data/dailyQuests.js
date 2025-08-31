// Daily quests data for the FinLit app
export const dailyQuestsData = [
  {
    id: 'daily_login',
    title: 'Daily Login',
    description: 'Log in to the app today',
    type: 'daily',
    category: 'engagement',
    reward: {
      xp: 50,
      coins: 25
    },
    requirement: 1,
    progress: 0,
    completed: false,
    icon: '📱',
    rarity: 'common'
  },
  {
    id: 'complete_lesson',
    title: 'Complete a Lesson',
    description: 'Finish any financial lesson',
    type: 'daily',
    category: 'learning',
    reward: {
      xp: 100,
      coins: 50
    },
    requirement: 1,
    progress: 0,
    completed: false,
    icon: '📚',
    rarity: 'common'
  },
  {
    id: 'track_expense',
    title: 'Track an Expense',
    description: 'Log at least one expense today',
    type: 'daily',
    category: 'tracking',
    reward: {
      xp: 75,
      coins: 30
    },
    requirement: 1,
    progress: 0,
    completed: false,
    icon: '💰',
    rarity: 'common'
  },
  {
    id: 'set_goal',
    title: 'Set a Financial Goal',
    description: 'Create or update a financial goal',
    type: 'daily',
    category: 'planning',
    reward: {
      xp: 80,
      coins: 40
    },
    requirement: 1,
    progress: 0,
    completed: false,
    icon: '🎯',
    rarity: 'common'
  },
  {
    id: 'save_money',
    title: 'Save Money',
    description: 'Add money to your piggy bank',
    type: 'daily',
    category: 'saving',
    reward: {
      xp: 120,
      coins: 60
    },
    requirement: 1,
    progress: 0,
    completed: false,
    icon: '🏦',
    rarity: 'common'
  },
  {
    id: 'complete_challenge',
    title: 'Complete a Challenge',
    description: 'Finish any financial challenge',
    type: 'daily',
    category: 'challenge',
    reward: {
      xp: 150,
      coins: 75
    },
    requirement: 1,
    progress: 0,
    completed: false,
    icon: '🏆',
    rarity: 'rare'
  },
  {
    id: 'read_tip',
    title: 'Read Financial Tip',
    description: 'Read a financial tip or article',
    type: 'daily',
    category: 'education',
    reward: {
      xp: 60,
      coins: 25
    },
    requirement: 1,
    progress: 0,
    completed: false,
    icon: '💡',
    rarity: 'common'
  },
  {
    id: 'budget_check',
    title: 'Budget Check',
    description: 'Review your monthly budget',
    type: 'daily',
    category: 'planning',
    reward: {
      xp: 90,
      coins: 45
    },
    requirement: 1,
    progress: 0,
    completed: false,
    icon: '📊',
    rarity: 'common'
  }
];

// Weekly quests
export const weeklyQuestsData = [
  {
    id: 'complete_5_lessons',
    title: 'Lesson Master',
    description: 'Complete 5 lessons this week',
    type: 'weekly',
    category: 'learning',
    reward: {
      xp: 300,
      coins: 150
    },
    requirement: 5,
    progress: 0,
    completed: false,
    icon: '🎓',
    rarity: 'rare'
  },
  {
    id: 'maintain_streak',
    title: 'Streak Keeper',
    description: 'Maintain 7-day login streak',
    type: 'weekly',
    category: 'engagement',
    reward: {
      xp: 400,
      coins: 200
    },
    requirement: 7,
    progress: 0,
    completed: false,
    icon: '🔥',
    rarity: 'rare'
  },
  {
    id: 'save_weekly',
    title: 'Weekly Saver',
    description: 'Save money for 5 consecutive days',
    type: 'weekly',
    category: 'saving',
    reward: {
      xp: 350,
      coins: 175
    },
    requirement: 5,
    progress: 0,
    completed: false,
    icon: '💎',
    rarity: 'rare'
  },
  {
    id: 'complete_challenges',
    title: 'Challenge Conqueror',
    description: 'Complete 3 challenges this week',
    type: 'weekly',
    category: 'challenge',
    reward: {
      xp: 500,
      coins: 250
    },
    requirement: 3,
    progress: 0,
    completed: false,
    icon: '⚔️',
    rarity: 'epic'
  }
];

// Monthly quests
export const monthlyQuestsData = [
  {
    id: 'complete_20_lessons',
    title: 'Learning Champion',
    description: 'Complete 20 lessons this month',
    type: 'monthly',
    category: 'learning',
    reward: {
      xp: 1000,
      coins: 500
    },
    requirement: 20,
    progress: 0,
    completed: false,
    icon: '🏆',
    rarity: 'epic'
  },
  {
    id: 'perfect_month',
    title: 'Perfect Month',
    description: 'Log in every day for a month',
    type: 'monthly',
    category: 'engagement',
    reward: {
      xp: 1500,
      coins: 750
    },
    requirement: 30,
    progress: 0,
    completed: false,
    icon: '⭐',
    rarity: 'legendary'
  },
  {
    id: 'savings_master',
    title: 'Savings Master',
    description: 'Save money for 25 days this month',
    type: 'monthly',
    category: 'saving',
    reward: {
      xp: 1200,
      coins: 600
    },
    requirement: 25,
    progress: 0,
    completed: false,
    icon: '👑',
    rarity: 'epic'
  }
];

// Helper function to get quests by type
export const getQuestsByType = (type) => {
  switch (type) {
    case 'daily':
      return dailyQuestsData;
    case 'weekly':
      return weeklyQuestsData;
    case 'monthly':
      return monthlyQuestsData;
    default:
      return [...dailyQuestsData, ...weeklyQuestsData, ...monthlyQuestsData];
  }
};

// Helper function to check quest completion
export const checkQuestCompletion = (quest, userProgress) => {
  const { completedLessons, completedChallenges, expenses, goals, streak, lastLogin } = userProgress;
  
  switch (quest.id) {
    case 'daily_login':
      return true; // Always available
    case 'complete_lesson':
      return completedLessons.length > 0;
    case 'track_expense':
      return expenses.length > 0;
    case 'set_goal':
      return goals.length > 0;
    case 'save_money':
      return userProgress.piggyBank?.balance > 0;
    case 'complete_challenge':
      return completedChallenges.length > 0;
    case 'read_tip':
      return true; // Always available
    case 'budget_check':
      return true; // Always available
    case 'complete_5_lessons':
      return completedLessons.length >= 5;
    case 'maintain_streak':
      return streak >= 7;
    case 'save_weekly':
      return userProgress.piggyBank?.history?.filter(h => h.type === 'deposit').length >= 5;
    case 'complete_challenges':
      return completedChallenges.length >= 3;
    case 'complete_20_lessons':
      return completedLessons.length >= 20;
    case 'perfect_month':
      return streak >= 30;
    case 'savings_master':
      return userProgress.piggyBank?.history?.filter(h => h.type === 'deposit').length >= 25;
    default:
      return false;
  }
};

// Helper function to get quest progress
export const getQuestProgress = (quest, userProgress) => {
  const { completedLessons, completedChallenges, expenses, goals, streak, piggyBank } = userProgress;
  
  switch (quest.id) {
    case 'daily_login':
      return 1;
    case 'complete_lesson':
      return Math.min(completedLessons.length, quest.requirement);
    case 'track_expense':
      return Math.min(expenses.length, quest.requirement);
    case 'set_goal':
      return Math.min(goals.length, quest.requirement);
    case 'save_money':
      return piggyBank?.balance > 0 ? 1 : 0;
    case 'complete_challenge':
      return Math.min(completedChallenges.length, quest.requirement);
    case 'read_tip':
      return 1;
    case 'budget_check':
      return 1;
    case 'complete_5_lessons':
      return Math.min(completedLessons.length, quest.requirement);
    case 'maintain_streak':
      return Math.min(streak, quest.requirement);
    case 'save_weekly':
      return Math.min(piggyBank?.history?.filter(h => h.type === 'deposit').length || 0, quest.requirement);
    case 'complete_challenges':
      return Math.min(completedChallenges.length, quest.requirement);
    case 'complete_20_lessons':
      return Math.min(completedLessons.length, quest.requirement);
    case 'perfect_month':
      return Math.min(streak, quest.requirement);
    case 'savings_master':
      return Math.min(piggyBank?.history?.filter(h => h.type === 'deposit').length || 0, quest.requirement);
    default:
      return 0;
  }
};
