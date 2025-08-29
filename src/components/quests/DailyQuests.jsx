import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';

const DailyQuests = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('daily');

  // Initialize daily quests if they don't exist
  useEffect(() => {
    if (!state.dailyQuests || !Array.isArray(state.dailyQuests.quests)) {
      // Generate sample quests
      const sampleQuests = [
        {
          id: 'quest1',
          title: 'Budget Review',
          description: 'Review your monthly budget and identify one area to improve.',
          reward: { xp: 20, coins: 50 },
          type: 'daily',
          completed: false,
          dateGenerated: new Date().toISOString()
        },
        {
          id: 'quest2',
          title: 'Expense Tracking',
          description: 'Log at least 3 expenses in the expense tracker.',
          reward: { xp: 15, coins: 30 },
          type: 'daily',
          completed: false,
          dateGenerated: new Date().toISOString()
        },
        {
          id: 'quest3',
          title: 'Savings Goal',
          description: 'Add money to your piggy bank.',
          reward: { xp: 25, coins: 40 },
          type: 'daily',
          completed: false,
          dateGenerated: new Date().toISOString()
        },
        {
          id: 'quest4',
          title: 'Financial Article',
          description: 'Read a short article about personal finance.',
          reward: { xp: 10, coins: 20 },
          type: 'daily',
          completed: false,
          dateGenerated: new Date().toISOString()
        },
        {
          id: 'weekly1',
          title: 'Investment Research',
          description: 'Research one investment option and write down its pros and cons.',
          reward: { xp: 50, coins: 100 },
          type: 'weekly',
          completed: false,
          dateGenerated: new Date().toISOString()
        },
        {
          id: 'weekly2',
          title: 'Expense Analysis',
          description: 'Analyze your spending patterns for the past week and identify trends.',
          reward: { xp: 40, coins: 80 },
          type: 'weekly',
          completed: false,
          dateGenerated: new Date().toISOString()
        }
      ];

      dispatch({
        type: 'INIT_DAILY_QUESTS',
        payload: {
          quests: sampleQuests,
          lastUpdated: new Date().toISOString(),
          streak: 0,
          lastCompletedDay: null
        }
      });
    }
  }, [state.dailyQuests, dispatch]);

  const handleCompleteQuest = (questId) => {
    dispatch({
      type: 'COMPLETE_DAILY_QUEST',
      payload: {
        questId,
        completedDate: new Date().toISOString()
      }
    });
  };

  // If quests are not initialized yet, show loading
  if (!state.dailyQuests || !Array.isArray(state.dailyQuests.quests)) {
    return <div className="text-center py-8">Loading quests...</div>;
  }

  // Filter quests based on active tab safely
  const filteredQuests = (state.dailyQuests.quests || []).filter((quest) => {
    if (activeTab === 'completed') return quest.completed;
    if (activeTab === 'daily') return quest.type === 'daily' && !quest.completed;
    if (activeTab === 'weekly') return quest.type === 'weekly' && !quest.completed;
    return true;
  });

  return (
    <div className="game-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text-secondary">Your Quests</h2>

        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-300">Streak:</div>
          <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
            <span className="text-yellow-500 mr-1">🔥</span>
            <span className="font-bold text-white">{state.dailyQuests.streak} days</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'daily'
              ? 'text-primary-light border-b-2 border-primary-light'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('daily')}
        >
          Daily
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'weekly'
              ? 'text-primary-light border-b-2 border-primary-light'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('weekly')}
        >
          Weekly
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'completed'
              ? 'text-primary-light border-b-2 border-primary-light'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>

      {/* Quest List */}
      <div className="space-y-4">
        {filteredQuests.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {activeTab === 'completed' ? 'No completed quests yet.' : 'No quests available.'}
          </div>
        ) : (
          filteredQuests.map((quest) => (
            <motion.div
              key={quest.id}
              className="game-card p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{quest.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{quest.description}</p>

                  <div className="flex space-x-3 text-sm">
                    <div className="flex items-center text-yellow-500">
                      <span className="mr-1">⭐</span>
                      <span>{quest.reward.xp} XP</span>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <span className="mr-1">🪙</span>
                      <span>{quest.reward.coins} coins</span>
                    </div>
                  </div>
                </div>

                {!quest.completed ? (
                  <button
                    onClick={() => handleCompleteQuest(quest.id)}
                    className="gradient-button-primary text-sm px-3 py-1 rounded-lg"
                  >
                    Complete
                  </button>
                ) : (
                  <div className="bg-primary bg-opacity-20 text-primary-light text-sm px-3 py-1 rounded-lg">
                    Completed ✓
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Quest Refresh Timer */}
      <div className="mt-6 text-center text-sm text-gray-400">
        <p>New quests will be available tomorrow</p>
        <p>Last updated: {new Date(state.dailyQuests.lastUpdated).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default DailyQuests;
