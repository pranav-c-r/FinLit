// Challenges data for the FinLit app
export const challengesData = [
  // Beginner Challenges
  {
    id: 'no_spend_week',
    title: 'No-Spend Week',
    description: 'Go for 7 days without spending on non-essentials',
    category: 'spending',
    difficulty: 'beginner',
    duration: '7 days',
    xpReward: 200,
    coinReward: 100,
    completed: false,
    icon: '🚫',
    requirements: [
      'Track all expenses',
      'Only spend on essentials (food, transport, bills)',
      'No entertainment, shopping, or dining out'
    ],
    tips: [
      'Plan meals in advance',
      'Use free entertainment options',
      'Track your progress daily'
    ]
  },
  {
    id: 'budget_master',
    title: 'Budget Master',
    description: 'Stay under your set budget for 14 days straight',
    category: 'budgeting',
    difficulty: 'beginner',
    duration: '14 days',
    xpReward: 300,
    coinReward: 150,
    completed: false,
    icon: '📊',
    requirements: [
      'Set a realistic daily budget',
      'Track all expenses',
      'Stay under budget every day'
    ],
    tips: [
      'Use cash envelopes',
      'Review spending daily',
      'Adjust budget if needed'
    ]
  },
  {
    id: 'savings_streak',
    title: 'Savings Streak',
    description: 'Save money for 10 consecutive days',
    category: 'saving',
    difficulty: 'beginner',
    duration: '10 days',
    xpReward: 250,
    coinReward: 125,
    completed: false,
    icon: '💰',
    requirements: [
      'Save any amount daily',
      'Use piggy bank feature',
      'Maintain streak for 10 days'
    ],
    tips: [
      'Start with small amounts',
      'Set daily reminders',
      'Celebrate milestones'
    ]
  },

  // Intermediate Challenges
  {
    id: 'debt_free_month',
    title: 'Debt-Free Month',
    description: 'Pay off one debt completely or make significant progress',
    category: 'debt',
    difficulty: 'intermediate',
    duration: '30 days',
    xpReward: 500,
    coinReward: 250,
    completed: false,
    icon: '💳',
    requirements: [
      'Identify target debt',
      'Create repayment plan',
      'Execute plan for 30 days'
    ],
    tips: [
      'Use debt snowball method',
      'Cut unnecessary expenses',
      'Find extra income sources'
    ]
  },
  {
    id: 'investment_starter',
    title: 'Investment Starter',
    description: 'Learn about investing and make your first investment decision',
    category: 'investing',
    difficulty: 'intermediate',
    duration: '21 days',
    xpReward: 400,
    coinReward: 200,
    completed: false,
    icon: '📈',
    requirements: [
      'Complete investment lessons',
      'Research investment options',
      'Create investment plan'
    ],
    tips: [
      'Start with index funds',
      'Diversify your portfolio',
      'Think long-term'
    ]
  },
  {
    id: 'expense_audit',
    title: 'Expense Audit',
    description: 'Analyze and optimize your spending patterns',
    category: 'tracking',
    difficulty: 'intermediate',
    duration: '14 days',
    xpReward: 350,
    coinReward: 175,
    completed: false,
    icon: '🔍',
    requirements: [
      'Track all expenses for 14 days',
      'Categorize spending',
      'Identify optimization opportunities'
    ],
    tips: [
      'Use expense tracking app',
      'Review categories weekly',
      'Set spending limits'
    ]
  },

  // Advanced Challenges
  {
    id: 'financial_independence_plan',
    title: 'Financial Independence Plan',
    description: 'Create a comprehensive plan for financial freedom',
    category: 'planning',
    difficulty: 'advanced',
    duration: '60 days',
    xpReward: 800,
    coinReward: 400,
    completed: false,
    icon: '🚀',
    requirements: [
      'Calculate financial independence number',
      'Create detailed savings plan',
      'Develop multiple income streams'
    ],
    tips: [
      'Use 4% rule for calculations',
      'Consider passive income',
      'Plan for contingencies'
    ]
  },
  {
    id: 'portfolio_optimizer',
    title: 'Portfolio Optimizer',
    description: 'Optimize your investment portfolio for better returns',
    category: 'investing',
    difficulty: 'advanced',
    duration: '45 days',
    xpReward: 700,
    coinReward: 350,
    completed: false,
    icon: '🎯',
    requirements: [
      'Analyze current portfolio',
      'Rebalance assets',
      'Implement optimization strategy'
    ],
    tips: [
      'Consider asset allocation',
      'Review risk tolerance',
      'Monitor performance'
    ]
  },
  {
    id: 'tax_optimization',
    title: 'Tax Optimization',
    description: 'Optimize your tax strategy and maximize deductions',
    category: 'taxes',
    difficulty: 'advanced',
    duration: '90 days',
    xpReward: 600,
    coinReward: 300,
    completed: false,
    icon: '🧾',
    requirements: [
      'Review tax situation',
      'Identify optimization opportunities',
      'Implement tax strategies'
    ],
    tips: [
      'Maximize retirement contributions',
      'Use tax-advantaged accounts',
      'Consider professional help'
    ]
  }
];

// Helper function to get challenges by difficulty
export const getChallengesByDifficulty = (difficulty) => {
  return challengesData.filter(challenge => challenge.difficulty === difficulty);
};

// Helper function to get challenges by category
export const getChallengesByCategory = (category) => {
  return challengesData.filter(challenge => challenge.category === category);
};

// Helper function to get challenge by ID
export const getChallengeById = (id) => {
  return challengesData.find(challenge => challenge.id === id);
};

// Helper function to get available challenges
export const getAvailableChallenges = (userProgress) => {
  const { level, completedChallenges } = userProgress;
  
  return challengesData.filter(challenge => {
    // Check if already completed
    if (completedChallenges.includes(challenge.id)) {
      return false;
    }
    
    // Check difficulty requirements
    switch (challenge.difficulty) {
      case 'beginner':
        return true;
      case 'intermediate':
        return level >= 3;
      case 'advanced':
        return level >= 7;
      default:
        return false;
    }
  });
};

// Helper function to get completed challenges
export const getCompletedChallenges = (userProgress) => {
  return challengesData.filter(challenge => 
    userProgress.completedChallenges.includes(challenge.id)
  );
};

// Helper function to check challenge completion
export const checkChallengeCompletion = (challengeId, userProgress) => {
  const challenge = getChallengeById(challengeId);
  if (!challenge) return false;
  
  // This would need to be implemented based on actual challenge tracking
  // For now, we'll check if it's in completed challenges
  return userProgress.completedChallenges.includes(challengeId);
};
