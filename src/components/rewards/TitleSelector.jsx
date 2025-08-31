import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getUnlockedItems } from '../../data/rewards';

const TitleSelector = () => {
  const { state, dispatch } = useApp();
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [showUnlockInfo, setShowUnlockInfo] = useState(false);

  const unlockedItems = getUnlockedItems(state.user);
  const unlockedTitles = unlockedItems.titles;

  const handleTitleSelect = (title) => {
    if (title.unlocked) {
      setSelectedTitle(title);
      setShowUnlockInfo(false);
    } else {
      setSelectedTitle(title);
      setShowUnlockInfo(true);
    }
  };

  const handleEquipTitle = () => {
    if (selectedTitle && selectedTitle.unlocked) {
      dispatch({
        type: 'SET_ACTIVE_TITLE',
        payload: selectedTitle.id
      });
      
      // Show success message
      alert(`Title "${selectedTitle.name}" equipped successfully!`);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-300';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-300';
    }
  };

  const getRarityBadge = (rarity) => {
    const colors = {
      common: 'bg-gray-600 text-gray-200',
      uncommon: 'bg-green-600 text-green-200',
      rare: 'bg-blue-600 text-blue-200',
      epic: 'bg-purple-600 text-purple-200',
      legendary: 'bg-yellow-600 text-yellow-200'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[rarity] || colors.common}`}>
        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
      </span>
    );
  };

  const getUnlockRequirement = (title) => {
    if (title.unlocked) return 'Unlocked';
    
    switch (title.id) {
      case 'student':
        return 'Complete 5 lessons';
      case 'saver':
        return 'Save ₹10,000 in Piggy Bank';
      case 'investor':
        return 'Complete 10 challenges';
      case 'budget_master':
        return 'Track expenses for 30 days';
      case 'streak_champion':
        return 'Maintain 7-day streak';
      case 'level_master':
        return 'Reach Level 10';
      case 'quest_completer':
        return 'Complete 50 quests';
      case 'social_butterfly':
        return 'Add 10 friends';
      case 'expense_tracker':
        return 'Track 100 expenses';
      case 'financial_guru':
        return 'Complete all lessons and challenges';
      default:
        return title.unlockRequirement || 'Complete specific requirements';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">Title Collection</h2>
        <p className="text-gray-300">Unlock and equip titles to showcase your achievements</p>
      </div>

      {/* Current Active Title */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl border border-primary/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Current Active Title</h3>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl">
            {state.user.activeTitle ? 
              unlockedTitles.find(t => t.id === state.user.activeTitle)?.emoji || '👑' : 
              '👤'
            }
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-white">
              {state.user.activeTitle ? 
                unlockedTitles.find(t => t.id === state.user.activeTitle)?.name || 'No Title' : 
                'No Title Equipped'
              }
            </h4>
            <p className="text-gray-300">
              {state.user.activeTitle ? 
                unlockedTitles.find(t => t.id === state.user.activeTitle)?.description || 'Your active title' : 
                'Equip a title to display your achievements'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Title Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {unlockedTitles.map((title) => (
          <div
            key={title.id}
            onClick={() => handleTitleSelect(title)}
            className={`bg-background-dark/50 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedTitle?.id === title.id 
                ? 'border-primary shadow-lg shadow-primary/25' 
                : title.unlocked 
                  ? 'border-accent/30 hover:border-accent/50' 
                  : 'border-gray-600 opacity-60'
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">{title.emoji}</div>
                {getRarityBadge(title.rarity)}
              </div>
              
              <h4 className="text-lg font-semibold text-white mb-2">{title.name}</h4>
              <p className="text-sm text-gray-300 mb-3">{title.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Status:</span>
                  <span className={title.unlocked ? 'text-green-400' : 'text-red-400'}>
                    {title.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                
                {!title.unlocked && (
                  <div className="text-xs text-gray-400">
                    <span className="block">Requirement:</span>
                    <span className="text-yellow-400">{getUnlockRequirement(title)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Title Details Modal */}
      {selectedTitle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-dark rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Title Details</h3>
              <button
                onClick={() => {
                  setSelectedTitle(null);
                  setShowUnlockInfo(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedTitle.emoji}</div>
              <h4 className="text-2xl font-bold text-white mb-2">{selectedTitle.name}</h4>
              <p className="text-gray-300 mb-3">{selectedTitle.description}</p>
              {getRarityBadge(selectedTitle.rarity)}
            </div>

            <div className="space-y-4">
              {selectedTitle.unlocked ? (
                <div>
                  <p className="text-green-400 text-center mb-4">✅ This title is unlocked!</p>
                  {state.user.activeTitle === selectedTitle.id ? (
                    <div className="text-center p-3 bg-primary/20 border border-primary/30 rounded-lg">
                      <p className="text-primary font-medium">Currently Equipped</p>
                    </div>
                  ) : (
                    <button
                      onClick={handleEquipTitle}
                      className="w-full bg-primary hover:bg-primary/80 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                    >
                      Equip Title
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-red-400 text-center mb-4">🔒 This title is locked</p>
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">To unlock this title:</p>
                    <p className="text-yellow-400 font-medium">{getUnlockRequirement(selectedTitle)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* How to Unlock More Titles */}
      <div className="bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-xl border border-purple-400/20 p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">How to Unlock More Titles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📚</div>
              <div>
                <h4 className="font-semibold text-white">Complete Lessons</h4>
                <p className="text-sm text-gray-300">Finish lessons to unlock academic titles</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h4 className="font-semibold text-white">Take Challenges</h4>
                <p className="text-sm text-gray-300">Complete challenges for achievement titles</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💰</div>
              <div>
                <h4 className="font-semibold text-white">Save Money</h4>
                <p className="text-sm text-gray-300">Use Piggy Bank to unlock saver titles</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔥</div>
              <div>
                <h4 className="font-semibold text-white">Maintain Streaks</h4>
                <p className="text-sm text-gray-300">Daily login for streak titles</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📊</div>
              <div>
                <h4 className="font-semibold text-white">Track Expenses</h4>
                <p className="text-sm text-gray-300">Monitor spending for tracker titles</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">👥</div>
              <div>
                <h4 className="font-semibold text-white">Social Features</h4>
                <p className="text-sm text-gray-300">Add friends for social titles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleSelector;