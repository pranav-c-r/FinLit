import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { rewardsData, getUnlockedItems } from '../data/rewards';
import { dailyQuestsData, weeklyQuestsData, monthlyQuestsData } from '../data/dailyQuests';
import { lessonsData } from '../data/lessons';
import { challengesData } from '../data/challenges';
import { expenseCategories } from '../data/expenseCategories';

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
  piggyBank: {
    balance: 0,
    lastDeposit: null,
    history: []
  },
  dailyQuests: dailyQuestsData,
  weeklyQuests: weeklyQuestsData,
  monthlyQuests: monthlyQuestsData,
  expenses: [],
  expenseCategories: expenseCategories,
  lessons: lessonsData,
  challenges: challengesData,
  rewards: rewardsData,
  social: [],
  goals: [],
  notifications: [],
  achievements: [],
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
    // User Progress Actions
    case 'ADD_XP':
      const newXp = state.user.xp + action.payload.xp;
      const shouldLevelUp = newXp >= (state.user.nextLevelXp || 1000);
      
      if (shouldLevelUp) {
        return {
          ...state,
          user: {
            ...state.user,
            xp: newXp - (state.user.nextLevelXp || 1000),
            level: state.user.level + 1,
            nextLevelXp: (state.user.nextLevelXp || 1000) * 1.5
          }
        };
      }
      
      return {
        ...state,
        user: {
          ...state.user,
          xp: newXp
        }
      };

    case 'ADD_COINS':
      return {
        ...state,
        user: {
          ...state.user,
          coins: state.user.coins + action.payload.coins
        }
      };

    case 'UPDATE_STREAK':
      return {
        ...state,
        user: {
          ...state.user,
          streak: action.payload.streak,
          lastLogin: new Date().toISOString()
        }
      };

    case 'INIT_QUESTS':
      return {
        ...state,
        dailyQuests: dailyQuestsData,
        weeklyQuests: weeklyQuestsData,
        monthlyQuests: monthlyQuestsData
      };

    // Lesson Actions
    case 'COMPLETE_LESSON':
      const lesson = state.lessons?.find(l => l.id === action.payload.lessonId);
      if (!lesson) return state;
      
      return {
        ...state,
        user: {
          ...state.user,
          xp: state.user.xp + (lesson.xpReward || 100),
          coins: state.user.coins + (lesson.coinReward || 50),
          completedLessons: [...(state.user.completedLessons || []), action.payload.lessonId]
        },
        lessons: state.lessons?.map(l => 
          l.id === action.payload.lessonId ? { ...l, completed: true } : l
        ) || []
      };

    // Challenge Actions
    case 'COMPLETE_CHALLENGE':
      const challenge = state.challenges?.find(c => c.id === action.payload.challengeId);
      if (!challenge) return state;
      
      return {
        ...state,
        user: {
          ...state.user,
          xp: state.user.xp + (challenge.xpReward || 200),
          coins: state.user.coins + (challenge.coinReward || 100),
          completedChallenges: [...(state.user.completedChallenges || []), action.payload.challengeId]
        },
        challenges: state.challenges?.map(c => 
          c.id === action.payload.challengeId ? { ...c, completed: true } : c
        ) || []
      };

    case 'UPDATE_LESSON_PROGRESS':
      return {
        ...state,
        lessons: state.lessons?.map(lesson => 
          lesson.id === action.payload.lessonId 
            ? { ...lesson, progress: action.payload.progress }
            : lesson
        ) || []
      };

    case 'UPDATE_CHALLENGE_PROGRESS':
      return {
        ...state,
        challenges: state.challenges?.map(challenge => 
          challenge.id === action.payload.challengeId 
            ? { ...challenge, progress: action.payload.progress }
            : challenge
        ) || []
      };

    // Quest Actions
    case 'COMPLETE_QUEST':
      const { questId, questType } = action.payload;
      let questsToUpdate;
      
      switch (questType) {
        case 'daily':
          questsToUpdate = 'dailyQuests';
          break;
        case 'weekly':
          questsToUpdate = 'weeklyQuests';
          break;
        case 'monthly':
          questsToUpdate = 'monthlyQuests';
          break;
        default:
          return state;
      }
      
      const quest = state[questsToUpdate]?.find(q => q.id === questId);
      if (!quest) return state;
      
      return {
        ...state,
        [questsToUpdate]: state[questsToUpdate]?.map(q => 
          q.id === questId ? { ...q, completed: true } : q
        ) || [],
        user: {
          ...state.user,
          xp: state.user.xp + (quest.reward?.xp || 50),
          coins: state.user.coins + (quest.reward?.coins || 25)
        }
      };

    case 'UPDATE_QUEST_PROGRESS':
      const { questId: updateQuestId, questType: updateQuestType, progress } = action.payload;
      let questsToUpdateProgress;
      
      switch (updateQuestType) {
        case 'daily':
          questsToUpdateProgress = 'dailyQuests';
          break;
        case 'weekly':
          questsToUpdateProgress = 'weeklyQuests';
          break;
        case 'monthly':
          questsToUpdateProgress = 'monthlyQuests';
          break;
        default:
          return state;
      }
      
      return {
        ...state,
        [questsToUpdateProgress]: state[questsToUpdateProgress]?.map(q => 
          q.id === updateQuestId ? { ...q, progress } : q
        ) || []
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
    case 'UPDATE_PIGGY_BANK_HISTORY':
      return {
        ...state,
        piggyBank: {
          ...state.piggyBank,
          history: action.payload.history
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
    case 'UPDATE_DAILY_QUEST_PROGRESS':
      return {
        ...state,
        dailyQuests: state.dailyQuests.map(quest => 
          quest.id === action.payload.questId 
            ? { ...quest, progress: action.payload.progress }
            : quest
        )
      };
    // Expense Tracker Actions
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload]
      };
    case 'ADD_INCOME':
      return {
        ...state,
        expenses: [...state.expenses, {...action.payload, type: 'income'}]
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
    case 'UPDATE_EXPENSE_CATEGORIES':
      return {
        ...state,
        expenseCategories: action.payload
      };
    case 'ADD_EXPENSE_CATEGORY':
      return {
        ...state,
        expenseCategories: [...state.expenseCategories, action.payload]
      };
    case 'UPDATE_EXPENSE_CATEGORY':
      return {
        ...state,
        expenseCategories: state.expenseCategories.map(category => 
          category.id === action.payload.id ? action.payload : category
        )
      };
    case 'DELETE_EXPENSE_CATEGORY':
      return {
        ...state,
        expenseCategories: state.expenseCategories.filter(category => category.id !== action.payload.id)
      };
    // Goal Actions
    case 'ADD_GOAL':
      return {
        ...state,
        user: {
          ...state.user,
          goals: [...(state.user.goals || []), action.payload]
        }
      };
    case 'UPDATE_GOAL':
      return {
        ...state,
        user: {
          ...state.user,
          goals: (state.user.goals || []).map(goal => 
            goal.id === action.payload.id ? action.payload : goal
          )
        }
      };
    case 'DELETE_GOAL':
      return {
        ...state,
        user: {
          ...state.user,
          goals: (state.user.goals || []).filter(goal => goal.id !== action.payload.id)
        }
      };

    case 'CREATE_GOAL':
      return {
        ...state,
        user: {
          ...state.user,
          goals: [...(state.user.goals || []), action.payload]
        }
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
    case 'UPDATE_USER_LEVEL':
      return {
        ...state,
        user: {
          ...state.user,
          level: action.payload.level,
          nextLevelXp: action.payload.nextLevelXp
        }
      };
    case 'UPDATE_USER_XP':
      return {
        ...state,
        user: {
          ...state.user,
          xp: action.payload.xp
        }
      };
    case 'UPDATE_USER_COINS':
      return {
        ...state,
        user: {
          ...state.user,
          coins: action.payload.coins
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
          activeTitle: action.payload
        }
      };
    case 'UPDATE_USER_TITLES':
      return {
        ...state,
        user: {
          ...state.user,
          titles: action.payload.titles
        }
      };
    case 'EQUIP_AVATAR':
      return {
        ...state,
        user: {
          ...state.user,
          avatar: action.payload
        }
      };
    case 'EQUIP_BANNER':
      return {
        ...state,
        user: {
          ...state.user,
          banner: action.payload
        }
      };
    case 'EQUIP_THEME':
      return {
        ...state,
        user: {
          ...state.user,
          theme: action.payload
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
    case 'REMOVE_FRIEND':
      return {
        ...state,
        user: {
          ...state.user,
          friends: state.user.friends.filter(friend => friend.id !== action.payload.friendId)
        }
      };
    case 'UPDATE_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload
      };
    case 'UPDATE_SOCIAL_DATA':
      return {
        ...state,
        social: action.payload
      };
    case 'UPDATE_ACHIEVEMENTS':
      return {
        ...state,
        achievements: action.payload
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    case 'UNLOCK_REWARD':
      return {
        ...state,
        rewards: state.rewards?.map(reward => 
          reward.id === action.payload.rewardId 
            ? { ...reward, unlocked: true }
            : reward
        ) || []
      };
    case 'UPDATE_REWARDS':
      return {
        ...state,
        rewards: action.payload
      };
    case 'PURCHASE_ITEM':
      const { itemType, itemId, cost } = action.payload;
      if (state.user.coins >= cost) {
        // Update user coins
        const updatedUser = {
          ...state.user,
          coins: state.user.coins - cost
        };

        // Update the specific item type to mark it as unlocked
        const updatedItems = { ...state[itemType] };
        const itemIndex = updatedItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            unlocked: true
          };
        }

        return {
          ...state,
          user: updatedUser,
          [itemType]: updatedItems
        };
      }
      return state;
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize quests on mount
  useEffect(() => {
    // Quests are already initialized in initial state
  }, []);

  // Check for level up
  useEffect(() => {
    if (state.user.xp >= state.user.nextLevelXp) {
      dispatch({ type: 'LEVEL_UP' });
    }
  }, [state.user.xp, state.user.nextLevelXp]);

  // Check daily streak
  useEffect(() => {
    const checkStreak = () => {
      const today = new Date().toDateString();
      const lastLogin = state.user.lastLogin ? new Date(state.user.lastLogin).toDateString() : null;
      
      if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = lastLogin === yesterday.toDateString();
        
        if (isConsecutive) {
          dispatch({
            type: 'UPDATE_STREAK',
            payload: { streak: state.user.streak + 1 }
          });
        } else if (lastLogin !== today) {
          dispatch({
            type: 'UPDATE_STREAK',
            payload: { streak: 1 }
          });
        }
      }
    };

    checkStreak();
  }, [state.user.lastLogin, state.user.streak]);

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