// Expense categories data for the FinLit app
export const expenseCategories = [
  // Essential Categories
  {
    id: 'housing',
    name: 'Housing',
    icon: '🏠',
    color: '#3B82F6',
    description: 'Rent, mortgage, utilities, maintenance',
    subcategories: [
      'Rent',
      'Mortgage',
      'Utilities',
      'Maintenance',
      'Insurance',
      'Property Tax'
    ],
    isEssential: true,
    budgetPercentage: 30
  },
  {
    id: 'food',
    name: 'Food & Dining',
    icon: '🍽️',
    color: '#10B981',
    description: 'Groceries, restaurants, takeout',
    subcategories: [
      'Groceries',
      'Restaurants',
      'Takeout',
      'Coffee',
      'Snacks',
      'Alcohol'
    ],
    isEssential: true,
    budgetPercentage: 15
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    color: '#F59E0B',
    description: 'Gas, public transit, car maintenance',
    subcategories: [
      'Gas',
      'Public Transit',
      'Car Maintenance',
      'Car Insurance',
      'Parking',
      'Ride Sharing'
    ],
    isEssential: true,
    budgetPercentage: 10
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    color: '#EF4444',
    description: 'Medical expenses, insurance, prescriptions',
    subcategories: [
      'Medical Bills',
      'Health Insurance',
      'Prescriptions',
      'Dental',
      'Vision',
      'Fitness'
    ],
    isEssential: true,
    budgetPercentage: 10
  },

  // Lifestyle Categories
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: '#8B5CF6',
    description: 'Movies, games, hobbies, subscriptions',
    subcategories: [
      'Movies & TV',
      'Gaming',
      'Hobbies',
      'Streaming Services',
      'Books & Magazines',
      'Events'
    ],
    isEssential: false,
    budgetPercentage: 5
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    color: '#EC4899',
    description: 'Clothing, electronics, personal items',
    subcategories: [
      'Clothing',
      'Electronics',
      'Personal Care',
      'Home Goods',
      'Gifts',
      'Other'
    ],
    isEssential: false,
    budgetPercentage: 5
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    color: '#06B6D4',
    description: 'Vacations, business trips, weekend getaways',
    subcategories: [
      'Flights',
      'Hotels',
      'Food & Dining',
      'Activities',
      'Transportation',
      'Souvenirs'
    ],
    isEssential: false,
    budgetPercentage: 5
  },
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    color: '#84CC16',
    description: 'Courses, books, workshops, certifications',
    subcategories: [
      'Courses',
      'Books',
      'Workshops',
      'Certifications',
      'Software',
      'Tools'
    ],
    isEssential: false,
    budgetPercentage: 5
  },

  // Financial Categories
  {
    id: 'debt',
    name: 'Debt Payments',
    icon: '💳',
    color: '#F97316',
    description: 'Credit cards, loans, student debt',
    subcategories: [
      'Credit Cards',
      'Student Loans',
      'Personal Loans',
      'Car Loans',
      'Other Debt'
    ],
    isEssential: true,
    budgetPercentage: 10
  },
  {
    id: 'savings',
    name: 'Savings & Investment',
    icon: '💰',
    color: '#22C55E',
    description: 'Emergency fund, retirement, investments',
    subcategories: [
      'Emergency Fund',
      'Retirement',
      'Investments',
      'Other Savings'
    ],
    isEssential: true,
    budgetPercentage: 20
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: '🛡️',
    color: '#6366F1',
    description: 'Life, auto, home, disability insurance',
    subcategories: [
      'Life Insurance',
      'Auto Insurance',
      'Home Insurance',
      'Disability Insurance',
      'Other Insurance'
    ],
    isEssential: true,
    budgetPercentage: 5
  },

  // Other Categories
  {
    id: 'personal',
    name: 'Personal',
    icon: '👤',
    color: '#A855F7',
    description: 'Personal care, grooming, wellness',
    subcategories: [
      'Haircuts',
      'Spa & Wellness',
      'Personal Care',
      'Gym Membership',
      'Other'
    ],
    isEssential: false,
    budgetPercentage: 3
  },
  {
    id: 'charity',
    name: 'Charity & Giving',
    icon: '❤️',
    color: '#F43F5E',
    description: 'Donations, gifts, charitable contributions',
    subcategories: [
      'Charitable Donations',
      'Gifts',
      'Tips',
      'Other Giving'
    ],
    isEssential: false,
    budgetPercentage: 2
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    icon: '📦',
    color: '#6B7280',
    description: 'Other expenses that don\'t fit categories',
    subcategories: [
      'Bank Fees',
      'Late Fees',
      'Other'
    ],
    isEssential: false,
    budgetPercentage: 2
  }
];

// Helper function to get category by ID
export const getCategoryById = (id) => {
  return expenseCategories.find(category => category.id === id);
};

// Helper function to get essential categories
export const getEssentialCategories = () => {
  return expenseCategories.filter(category => category.isEssential);
};

// Helper function to get non-essential categories
export const getNonEssentialCategories = () => {
  return expenseCategories.filter(category => !category.isEssential);
};

// Helper function to get categories by budget percentage
export const getCategoriesByBudgetPercentage = (percentage) => {
  return expenseCategories.filter(category => category.budgetPercentage === percentage);
};

// Helper function to get subcategories by category ID
export const getSubcategoriesByCategoryId = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.subcategories : [];
};

// Helper function to get category color
export const getCategoryColor = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.color : '#6B7280';
};

// Helper function to get category icon
export const getCategoryIcon = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.icon : '📦';
};

// Helper function to get total budget percentage
export const getTotalBudgetPercentage = () => {
  return expenseCategories.reduce((total, category) => total + category.budgetPercentage, 0);
};

// Helper function to validate budget percentages
export const validateBudgetPercentages = () => {
  const total = getTotalBudgetPercentage();
  return {
    total,
    isValid: total === 100,
    message: total === 100 ? 'Budget percentages are valid' : `Total budget percentage is ${total}%, should be 100%`
  };
};
