import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const DailyQuests = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('daily');

  const handleCompleteQuest = (questId, questType) => {
    dispatch({
      type: 'COMPLETE_QUEST',
      payload: { questId, questType }
    });
  };

  const getQuestsByType = (type) => {
    switch (type) {
      case 'daily':
        return state.dailyQuests;
      case 'weekly':
        return state.weeklyQuests;
      case 'monthly':
        return state.monthlyQuests;
      default:
        return [];
    }
  };

  const getQuestProgress = (quest) => {
    if (quest.type === 'daily') {
      return quest.progress || 0;
    }
    return quest.progress || 0;
  };

  const getQuestStatus = (quest) => {
    if (quest.completed) return 'completed';
    if (getQuestProgress(quest) > 0) return 'in_progress';
    return 'not_started';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'not_started':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'not_started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  const renderQuestCard = (quest) => {
    const status = getQuestStatus(quest);
    const progress = getQuestProgress(quest);
    const progressPercentage = (progress / quest.requirement) * 100;

    return (
      <div
        key={quest.id}
        className={`p-4 rounded-lg border transition-all duration-200 ${
          status === 'completed'
            ? 'border-green-500/50 bg-green-500/10'
            : status === 'in_progress'
            ? 'border-yellow-500/50 bg-yellow-500/10'
            : 'border-accent/30 bg-background-dark/50'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{quest.icon}</div>
            <div>
              <h3 className="font-semibold text-white">{quest.title}</h3>
              <p className="text-sm text-gray-300">{quest.description}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-300 mb-1">
            <span>Progress: {progress}/{quest.requirement}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                status === 'completed'
                  ? 'bg-green-500'
                  : status === 'in_progress'
                  ? 'bg-yellow-500'
                  : 'bg-gray-600'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">⭐</span>
              <span className="text-gray-300">{quest.reward.xp} XP</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">💰</span>
              <span className="text-gray-300">{quest.reward.coins} Coins</span>
            </div>
          </div>

          {status === 'completed' ? (
            <div className="flex items-center space-x-2 text-green-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Completed!</span>
            </div>
          ) : (
            <button
              onClick={() => handleCompleteQuest(quest.id, quest.type)}
              disabled={status === 'not_started'}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                status === 'in_progress'
                  ? 'bg-primary hover:bg-primary/80 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {status === 'in_progress' ? 'Complete' : 'Locked'}
            </button>
          )}
        </div>

        {quest.rarity && (
          <div className="mt-3 pt-3 border-t border-accent/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Rarity:</span>
              <span className={`px-2 py-1 rounded ${
                quest.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                quest.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                quest.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {quest.rarity.charAt(0).toUpperCase() + quest.rarity.slice(1)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    const quests = getQuestsByType(activeTab);
    const completedQuests = quests.filter(q => q.completed);
    const inProgressQuests = quests.filter(q => getQuestStatus(q) === 'in_progress');
    const notStartedQuests = quests.filter(q => getQuestStatus(q) === 'not_started');

    return (
      <div className="space-y-6">
        {/* Quest Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
            <div className="text-2xl text-green-400 mb-2">✅</div>
            <div className="text-2xl font-bold text-white">{completedQuests.length}</div>
            <div className="text-sm text-gray-300">Completed</div>
          </div>
          <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
            <div className="text-2xl text-yellow-400 mb-2">🔄</div>
            <div className="text-2xl font-bold text-white">{inProgressQuests.length}</div>
            <div className="text-sm text-gray-300">In Progress</div>
          </div>
          <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
            <div className="text-2xl text-gray-400 mb-2">🔒</div>
            <div className="text-2xl font-bold text-white">{notStartedQuests.length}</div>
            <div className="text-sm text-gray-300">Locked</div>
          </div>
        </div>

        {/* Quests List */}
        <div className="space-y-4">
          {quests.length > 0 ? (
            quests.map(renderQuestCard)
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-4">📝</div>
              <p>No quests available for this period</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">Daily Quests</h2>
        <p className="text-gray-300">Complete quests to earn XP, coins, and unlock rewards!</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-background-dark rounded-lg p-1">
          {[
            { id: 'daily', label: 'Daily', icon: '📅' },
            { id: 'weekly', label: 'Weekly', icon: '📊' },
            { id: 'monthly', label: 'Monthly', icon: '🗓️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Quest Benefits */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">Quest Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⭐</div>
            <div>
              <h4 className="font-semibold text-white">Earn XP</h4>
              <p className="text-sm text-gray-300">Level up your profile and unlock new features</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">💰</div>
            <div>
              <h4 className="font-semibold text-white">Collect Coins</h4>
              <p className="text-sm text-gray-300">Use coins to purchase premium avatars and themes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🏆</div>
            <div>
              <h4 className="font-semibold text-white">Unlock Rewards</h4>
              <p className="text-sm text-gray-300">Access exclusive avatars, banners, and titles</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📈</div>
            <div>
              <h4 className="font-semibold text-white">Track Progress</h4>
              <p className="text-sm text-gray-300">Monitor your financial learning journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuests;
