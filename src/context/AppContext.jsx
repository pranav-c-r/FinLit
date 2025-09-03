import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: {
    name: 'User',
    level: 1,
    xp: 250,
    nextLevelXp: 500,
    coins: 1000,
    completedLessons: [],
    completedChallenges: [],
    goals: [],
    avatar: '👤',
    banner: 'default',
    theme: 'default',
    titles: ['Beginner'],
    activeTitle: 'Beginner',
    streak: 0,
    lastLogin: null,
    friends: []
  },
  piggyBank: null,
  dailyQuests: [],
  expenses: [],
  theme: 'dark'
};

function appReducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_LESSON':
      return {
        ...state,
        user: {
          ...state.user,
          xp: state.user.xp + action.payload.xp,
          coins: state.user.coins + action.payload.coins,
          completedLessons: [...state.user.completedLessons, action.payload.lessonId]
        }
      };
    case 'COMPLETE_CHALLENGE':
      return {
        ...state,
        user: {
          ...state.user,
          xp: state.user.xp + action.payload.xp,
          coins: state.user.coins + action.payload.coins,
          completedChallenges: [...state.user.completedChallenges, action.payload.challengeId]
        }
      };
    case 'ADD_GOAL':
      return {
        ...state,
        user: {
          ...state.user,
          goals: [...state.user.goals, action.payload]
        }
      };
    case 'UPDATE_GOAL':
      return {
        ...state,
        user: {
          ...state.user,
          goals: state.user.goals.map(goal => 
            goal.id === action.payload.id ? action.payload : goal
          )
        }
      };
    case 'LEVEL_UP':
      return {
        ...state,
        user: {
          ...state.user,
          level: state.user.level + 1,
          nextLevelXp: state.user.nextLevelXp * 2
        }
      };
    // Piggy Bank Actions
    case 'INIT_PIGGY_BANK':
      return {
        ...state,
        piggyBank: action.payload
      };
    case 'DEPOSIT_TO_PIGGY_BANK':
      const newBalance = (state.piggyBank?.balance || 0) + action.payload.amount;
      return {
        ...state,
        piggyBank: {
          ...state.piggyBank,
          balance: newBalance,
          lastDeposit: action.payload.date,
          history: [
            {
              type: 'deposit',
              amount: action.payload.amount,
              date: action.payload.date
            },
            ...(state.piggyBank?.history || [])
          ]
        }
      };
    case 'BREAK_PIGGY_BANK':
      const withdrawnAmount = state.piggyBank?.balance || 0;
      return {
        ...state,
        user: {
          ...state.user,
          coins: state.user.coins + withdrawnAmount
        },
        piggyBank: {
          balance: 0,
          lastDeposit: null,
          history: [
            {
              type: 'withdraw',
              amount: withdrawnAmount,
              date: action.payload.date
            },
            ...(state.piggyBank?.history || [])
          ]
        }
      };
    // Daily Quests Actions
    case 'INIT_DAILY_QUESTS':
      return {
        ...state,
        dailyQuests: action.payload
      };
    case 'COMPLETE_DAILY_QUEST':
      return {
        ...state,
        dailyQuests: state.dailyQuests.map(quest => 
          quest.id === action.payload.questId ? { ...quest, completed: true } : quest
        ),
        user: {
          ...state.user,
          xp: state.user.xp + action.payload.xp,
          coins: state.user.coins + action.payload.coins
        }
      };
    // Expense Tracker Actions
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload]
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense => 
          expense.id === action.payload.id ? action.payload : expense
        )
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
      };
    // Profile & Rewards Actions
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    case 'UNLOCK_TITLE':
      return {
        ...state,
        user: {
          ...state.user,
          titles: [...state.user.titles, action.payload.title]
        }
      };
    case 'SET_ACTIVE_TITLE':
      return {
        ...state,
        user: {
          ...state.user,
          activeTitle: action.payload.title
        }
      };
    case 'ADD_FRIEND':
      return {
        ...state,
        user: {
          ...state.user,
          friends: [...state.user.friends, action.payload.friend]
        }
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}