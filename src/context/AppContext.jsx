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
    goals: []
  },
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