// Lessons data for the FinLit app
export const lessonsData = [
  // Beginner Level Lessons
  {
    id: 'budgeting_basics',
    title: 'Budgeting Basics',
    description: 'Learn the fundamentals of creating and maintaining a personal budget',
    category: 'budgeting',
    difficulty: 'beginner',
    duration: '15 min',
    xpReward: 100,
    coinReward: 50,
    completed: false,
    icon: '📊',
    topics: [
      'What is a budget?',
      'Income vs Expenses',
      '50/30/20 Rule',
      'Creating your first budget'
    ],
    quiz: [
      {
        question: 'What percentage of your income should go to needs?',
        options: ['30%', '50%', '70%', '20%'],
        correct: 1
      },
      {
        question: 'Which of these is NOT a basic budget category?',
        options: ['Housing', 'Entertainment', 'Gambling', 'Transportation'],
        correct: 2
      }
    ]
  },
  {
    id: 'saving_fundamentals',
    title: 'Saving Fundamentals',
    description: 'Master the art of saving money and building financial security',
    category: 'saving',
    difficulty: 'beginner',
    duration: '20 min',
    xpReward: 120,
    coinReward: 60,
    completed: false,
    icon: '💰',
    topics: [
      'Why save money?',
      'Emergency funds',
      'Saving strategies',
      'Automated saving'
    ],
    quiz: [
      {
        question: 'How many months of expenses should your emergency fund cover?',
        options: ['1-2 months', '3-6 months', '9-12 months', 'No need'],
        correct: 1
      },
      {
        question: 'What is the best way to start saving?',
        options: ['Wait for a big bonus', 'Start small and consistent', 'Borrow money', 'Ignore expenses'],
        correct: 1
      }
    ]
  },
  {
    id: 'debt_management',
    title: 'Debt Management',
    description: 'Understand different types of debt and how to manage them effectively',
    category: 'debt',
    difficulty: 'beginner',
    duration: '25 min',
    xpReward: 150,
    coinReward: 75,
    completed: false,
    icon: '💳',
    topics: [
      'Good vs Bad debt',
      'Credit cards',
      'Debt repayment strategies',
      'Avoiding debt traps'
    ],
    quiz: [
      {
        question: 'Which type of debt is generally considered "good"?',
        options: ['Credit card debt', 'Student loans', 'Payday loans', 'Personal loans'],
        correct: 1
      },
      {
        question: 'What is the best strategy for paying off multiple debts?',
        options: ['Pay minimum on all', 'Pay off highest interest first', 'Ignore them', 'Borrow more'],
        correct: 1
      }
    ]
  },

  // Intermediate Level Lessons
  {
    id: 'investment_basics',
    title: 'Investment Basics',
    description: 'Introduction to investing and building wealth over time',
    category: 'investing',
    difficulty: 'intermediate',
    duration: '30 min',
    xpReward: 200,
    coinReward: 100,
    completed: false,
    icon: '📈',
    topics: [
      'What is investing?',
      'Risk vs Return',
      'Types of investments',
      'Getting started'
    ],
    quiz: [
      {
        question: 'What is the relationship between risk and return?',
        options: ['No relationship', 'Higher risk = higher potential return', 'Lower risk = higher return', 'Risk doesn\'t matter'],
        correct: 1
      },
      {
        question: 'Which investment is generally safest?',
        options: ['Stocks', 'Bonds', 'Cryptocurrency', 'Commodities'],
        correct: 1
      }
    ]
  },
  {
    id: 'retirement_planning',
    title: 'Retirement Planning',
    description: 'Plan for your future and understand retirement savings options',
    category: 'retirement',
    difficulty: 'intermediate',
    duration: '35 min',
    xpReward: 250,
    coinReward: 125,
    completed: false,
    icon: '🏖️',
    topics: [
      'Why plan for retirement?',
      'Retirement accounts',
      'Compound interest',
      'Social Security basics'
    ],
    quiz: [
      {
        question: 'When should you start saving for retirement?',
        options: ['When you\'re 50', 'As early as possible', 'Never', 'Only when rich'],
        correct: 1
      },
      {
        question: 'What is compound interest?',
        options: ['Interest on interest', 'Simple interest', 'No interest', 'Negative interest'],
        correct: 0
      }
    ]
  },
  {
    id: 'tax_basics',
    title: 'Tax Basics',
    description: 'Understand how taxes work and how to minimize your tax burden',
    category: 'taxes',
    difficulty: 'intermediate',
    duration: '40 min',
    xpReward: 300,
    coinReward: 150,
    completed: false,
    icon: '🧾',
    topics: [
      'How taxes work',
      'Tax deductions',
      'Tax-advantaged accounts',
      'Filing taxes'
    ],
    quiz: [
      {
        question: 'What is a tax deduction?',
        options: ['Money you owe', 'Expense that reduces taxable income', 'Tax refund', 'Penalty'],
        correct: 1
      },
      {
        question: 'When are taxes typically due?',
        options: ['January 1st', 'April 15th', 'December 31st', 'Never'],
        correct: 1
      }
    ]
  },

  // Advanced Level Lessons
  {
    id: 'advanced_investing',
    title: 'Advanced Investing',
    description: 'Deep dive into advanced investment strategies and portfolio management',
    category: 'investing',
    difficulty: 'advanced',
    duration: '45 min',
    xpReward: 400,
    coinReward: 200,
    completed: false,
    icon: '🎯',
    topics: [
      'Portfolio diversification',
      'Asset allocation',
      'Market analysis',
      'Investment psychology'
    ],
    quiz: [
      {
        question: 'What is portfolio diversification?',
        options: ['Putting all money in one stock', 'Spreading investments across different assets', 'Ignoring your portfolio', 'Selling everything'],
        correct: 1
      },
      {
        question: 'What is asset allocation?',
        options: ['How you divide money between different investment types', 'How much you spend', 'Your salary', 'Your debt'],
        correct: 0
      }
    ]
  },
  {
    id: 'estate_planning',
    title: 'Estate Planning',
    description: 'Plan for the future and protect your family\'s financial security',
    category: 'planning',
    difficulty: 'advanced',
    duration: '50 min',
    xpReward: 500,
    coinReward: 250,
    completed: false,
    icon: '🏛️',
    topics: [
      'Wills and trusts',
      'Life insurance',
      'Estate taxes',
      'Legacy planning'
    ],
    quiz: [
      {
        question: 'What is a will?',
        options: ['A legal document', 'A game', 'A type of insurance', 'A loan'],
        correct: 0
      },
      {
        question: 'Why is life insurance important?',
        options: ['It\'s not important', 'Protects family financially', 'Makes you rich', 'Avoids taxes'],
        correct: 1
      }
    ]
  },
  {
    id: 'financial_independence',
    title: 'Financial Independence',
    description: 'Achieve financial freedom and early retirement through smart planning',
    category: 'planning',
    difficulty: 'advanced',
    duration: '55 min',
    xpReward: 600,
    coinReward: 300,
    completed: false,
    icon: '🚀',
    topics: [
      'FIRE movement',
      'Passive income',
      'Early retirement strategies',
      'Sustainable withdrawal rates'
    ],
    quiz: [
      {
        question: 'What does FIRE stand for?',
        options: ['Financial Independence, Retire Early', 'Fast Investment Returns', 'Financial Investment Rules', 'Future Income Retirement'],
        correct: 0
      },
      {
        question: 'What is passive income?',
        options: ['Money earned while working', 'Money earned without active work', 'Government benefits', 'Loan money'],
        correct: 1
      }
    ]
  }
];

// Helper function to get lessons by difficulty
export const getLessonsByDifficulty = (difficulty) => {
  return lessonsData.filter(lesson => lesson.difficulty === difficulty);
};

// Helper function to get lessons by category
export const getLessonsByCategory = (category) => {
  return lessonsData.filter(lesson => lesson.category === category);
};

// Helper function to get lesson by ID
export const getLessonById = (id) => {
  return lessonsData.find(lesson => lesson.id === id);
};

// Helper function to get completed lessons
export const getCompletedLessons = (userProgress) => {
  return lessonsData.filter(lesson => userProgress.completedLessons.includes(lesson.id));
};

// Helper function to get available lessons
export const getAvailableLessons = (userProgress) => {
  const { level } = userProgress;
  
  return lessonsData.filter(lesson => {
    switch (lesson.difficulty) {
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
