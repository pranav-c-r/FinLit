// Goals data for the FinLit app
export const goalsData = [
  {
    id: 'emergency_fund',
    title: 'Emergency Fund',
    description: 'Build a 6-month emergency fund',
    category: 'saving',
    type: 'target',
    targetAmount: 15000,
    currentAmount: 5000,
    currency: 'USD',
    deadline: '2024-12-31',
    status: 'in_progress',
    priority: 'high',
    icon: '🛡️',
    milestones: [
      { amount: 5000, description: '2 months covered', achieved: true },
      { amount: 7500, description: '3 months covered', achieved: false },
      { amount: 10000, description: '4 months covered', achieved: false },
      { amount: 12500, description: '5 months covered', achieved: false },
      { amount: 15000, description: '6 months covered', achieved: false }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: 'vacation_savings',
    title: 'Vacation Fund',
    description: 'Save for summer vacation to Europe',
    category: 'saving',
    type: 'target',
    targetAmount: 5000,
    currentAmount: 1200,
    currency: 'USD',
    deadline: '2024-06-01',
    status: 'in_progress',
    priority: 'medium',
    icon: '✈️',
    milestones: [
      { amount: 1000, description: '20% saved', achieved: true },
      { amount: 2500, description: '50% saved', achieved: false },
      { amount: 4000, description: '80% saved', achieved: false },
      { amount: 5000, description: '100% saved', achieved: false }
    ],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15'
  },
  {
    id: 'debt_free',
    title: 'Become Debt Free',
    description: 'Pay off all credit card debt',
    category: 'debt',
    type: 'target',
    targetAmount: 8000,
    currentAmount: 8000,
    currency: 'USD',
    deadline: '2024-08-01',
    status: 'completed',
    priority: 'high',
    icon: '💳',
    milestones: [
      { amount: 6000, description: '25% paid off', achieved: true },
      { amount: 4000, description: '50% paid off', achieved: true },
      { amount: 2000, description: '75% paid off', achieved: true },
      { amount: 0, description: '100% paid off', achieved: true }
    ],
    createdAt: '2023-06-01',
    updatedAt: '2024-01-10'
  },
  {
    id: 'investment_start',
    title: 'Start Investing',
    description: 'Begin investing in index funds',
    category: 'investing',
    type: 'habit',
    targetAmount: null,
    currentAmount: null,
    currency: 'USD',
    deadline: '2024-03-01',
    status: 'not_started',
    priority: 'medium',
    icon: '📈',
    milestones: [
      { amount: null, description: 'Research investment options', achieved: false },
      { amount: null, description: 'Open investment account', achieved: false },
      { amount: null, description: 'Make first investment', achieved: false }
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: 'side_income',
    title: 'Side Income Stream',
    description: 'Generate $500/month in passive income',
    category: 'income',
    type: 'target',
    targetAmount: 500,
    currentAmount: 150,
    currency: 'USD',
    deadline: '2024-12-31',
    status: 'in_progress',
    priority: 'low',
    icon: '💼',
    milestones: [
      { amount: 100, description: '20% of target', achieved: true },
      { amount: 250, description: '50% of target', achieved: false },
      { amount: 400, description: '80% of target', achieved: false },
      { amount: 500, description: '100% of target', achieved: false }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  }
];

// Goal categories
export const goalCategories = [
  {
    id: 'saving',
    name: 'Saving',
    icon: '💰',
    description: 'Build wealth and financial security'
  },
  {
    id: 'debt',
    name: 'Debt',
    icon: '💳',
    description: 'Pay off debts and become debt-free'
  },
  {
    id: 'investing',
    name: 'Investing',
    icon: '📈',
    description: 'Grow wealth through investments'
  },
  {
    id: 'income',
    name: 'Income',
    icon: '💼',
    description: 'Increase income and create new streams'
  },
  {
    id: 'expense',
    name: 'Expense',
    icon: '📊',
    description: 'Reduce expenses and optimize spending'
  },
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    description: 'Invest in skills and knowledge'
  }
];

// Goal types
export const goalTypes = [
  {
    id: 'target',
    name: 'Target Amount',
    description: 'Save or pay off a specific amount'
  },
  {
    id: 'habit',
    name: 'Habit Building',
    description: 'Develop consistent financial habits'
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Achieve a goal by a specific date'
  }
];

// Helper function to get goals by category
export const getGoalsByCategory = (category) => {
  return goalsData.filter(goal => goal.category === category);
};

// Helper function to get goals by status
export const getGoalsByStatus = (status) => {
  return goalsData.filter(goal => goal.status === status);
};

// Helper function to get goals by priority
export const getGoalsByPriority = (priority) => {
  return goalsData.filter(goal => goal.priority === priority);
};

// Helper function to get goal by ID
export const getGoalById = (id) => {
  return goalsData.find(goal => goal.id === id);
};

// Helper function to calculate goal progress
export const calculateGoalProgress = (goal) => {
  if (goal.type === 'habit') {
    // For habit goals, calculate based on milestones achieved
    const achievedMilestones = goal.milestones.filter(m => m.achieved).length;
    return (achievedMilestones / goal.milestones.length) * 100;
  } else {
    // For target goals, calculate based on amount
    if (goal.targetAmount === 0) return 100;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  }
};

// Helper function to get goal status
export const getGoalStatus = (goal) => {
  const progress = calculateGoalProgress(goal);
  
  if (progress >= 100) return 'completed';
  if (progress >= 75) return 'near_completion';
  if (progress >= 50) return 'halfway';
  if (progress >= 25) return 'in_progress';
  return 'not_started';
};

// Helper function to create new goal
export const createGoal = (goalData) => {
  const newGoal = {
    id: `goal_${Date.now()}`,
    ...goalData,
    status: 'not_started',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add default milestones for target goals
  if (goalData.type === 'target' && goalData.targetAmount) {
    const amount = goalData.targetAmount;
    newGoal.milestones = [
      { amount: amount * 0.25, description: '25% completed', achieved: false },
      { amount: amount * 0.5, description: '50% completed', achieved: false },
      { amount: amount * 0.75, description: '75% completed', achieved: false },
      { amount: amount, description: '100% completed', achieved: false }
    ];
  }
  
  return newGoal;
};

// Helper function to update goal progress
export const updateGoalProgress = (goalId, newAmount) => {
  const goal = getGoalById(goalId);
  if (!goal) return null;
  
  const updatedGoal = {
    ...goal,
    currentAmount: newAmount,
    updatedAt: new Date().toISOString()
  };
  
  // Update milestones
  updatedGoal.milestones = goal.milestones.map(milestone => ({
    ...milestone,
    achieved: newAmount >= milestone.amount
  }));
  
  // Update status
  updatedGoal.status = getGoalStatus(updatedGoal);
  
  return updatedGoal;
};

// Helper function to delete goal
export const deleteGoal = (goalId) => {
  // This would typically make an API call
  // For now, we'll just return success
  return {
    success: true,
    message: 'Goal deleted successfully'
  };
};
