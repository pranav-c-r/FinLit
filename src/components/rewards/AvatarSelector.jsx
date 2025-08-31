import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const AvatarSelector = ({ unlockedAvatars, onSelectAvatar }) => {
  const { state, dispatch } = useApp();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleAvatarSelect = (avatar) => {
    if (avatar.unlocked) {
      setSelectedAvatar(avatar);
      setShowPreview(true);
    }
  };

  const handleEquipAvatar = () => {
    if (selectedAvatar && selectedAvatar.unlocked) {
      dispatch({
        type: 'EQUIP_AVATAR',
        payload: selectedAvatar.id
      });
      
      // Show success message
      alert(`Avatar "${selectedAvatar.name}" equipped successfully!`);
      setShowPreview(false);
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

  const getUnlockRequirement = (avatar) => {
    if (avatar.unlocked) return 'Unlocked';
    
    switch (avatar.id) {
      case 'student':
        return 'Complete 3 lessons';
      case 'saver':
        return 'Save ₹5,000 in Piggy Bank';
      case 'investor':
        return 'Complete 5 challenges';
      case 'budget_master':
        return 'Track expenses for 15 days';
      case 'streak_champion':
        return 'Maintain 5-day streak';
      case 'level_master':
        return 'Reach Level 8';
      case 'quest_completer':
        return 'Complete 20 quests';
      case 'social_butterfly':
        return 'Add 3 friends';
      case 'expense_tracker':
        return 'Track 25 expenses';
      case 'financial_guru':
        return 'Complete all beginner lessons';
      default:
        return avatar.unlockRequirement || 'Complete specific requirements';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">Avatar Collection</h2>
        <p className="text-gray-300">Unlock and equip avatars to personalize your profile</p>
      </div>

      {/* Current Active Avatar */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl border border-primary/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Current Active Avatar</h3>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-4xl shadow-lg">
            {state.user.avatar || '👤'}
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-white">
              {unlockedAvatars.find(a => a.id === state.user.avatar)?.name || 'Default Avatar'}
            </h4>
            <p className="text-gray-300">
              {unlockedAvatars.find(a => a.id === state.user.avatar)?.description || 'Your active avatar'}
            </p>
          </div>
        </div>
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {unlockedAvatars.map((avatar) => (
          <div
            key={avatar.id}
            onClick={() => handleAvatarSelect(avatar)}
            className={`bg-background-dark/50 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedAvatar?.id === avatar.id 
                ? 'border-primary shadow-lg shadow-primary/25' 
                : avatar.unlocked 
                  ? 'border-accent/30 hover:border-accent/50' 
                  : 'border-gray-600 opacity-60'
            }`}
          >
            <div className="p-4 text-center">
              <div className="mb-3">
                <div className={`w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-3xl ${
                  !avatar.unlocked ? 'opacity-50' : ''
                }`}>
                  {avatar.unlocked ? avatar.emoji : '🔒'}
                </div>
              </div>
              
              <div className="flex items-center justify-center mb-2">
                {getRarityBadge(avatar.rarity)}
              </div>
              
              <h4 className="text-sm font-semibold text-white mb-1">{avatar.name}</h4>
              <p className="text-xs text-gray-300 mb-2">{avatar.description}</p>
              
              <div className="space-y-1">
                <div className="flex items-center justify-center text-xs">
                  <span className={avatar.unlocked ? 'text-green-400' : 'text-red-400'}>
                    {avatar.unlocked ? '✅ Unlocked' : '🔒 Locked'}
                  </span>
                </div>
                
                {!avatar.unlocked && (
                  <div className="text-xs text-gray-400">
                    <span className="text-yellow-400">{getUnlockRequirement(avatar)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Avatar Preview Modal */}
      {showPreview && selectedAvatar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-dark rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Avatar Preview</h3>
              <button
                onClick={() => {
                  setSelectedAvatar(null);
                  setShowPreview(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-6xl mb-4">
                  {selectedAvatar.emoji}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{selectedAvatar.name}</h4>
                <p className="text-gray-300 mb-3">{selectedAvatar.description}</p>
                {getRarityBadge(selectedAvatar.rarity)}
              </div>

              {state.user.avatar === selectedAvatar.id ? (
                <div className="text-center p-3 bg-primary/20 border border-primary/30 rounded-lg">
                  <p className="text-primary font-medium">Currently Equipped</p>
                </div>
              ) : (
                <button
                  onClick={handleEquipAvatar}
                  className="w-full bg-primary hover:bg-primary/80 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Equip Avatar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* How to Unlock More Avatars */}
      <div className="bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-xl border border-green-400/20 p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">How to Unlock More Avatars</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📚</div>
              <div>
                <h4 className="font-semibold text-white">Complete Lessons</h4>
                <p className="text-sm text-gray-300">Finish lessons to unlock academic avatars</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h4 className="font-semibold text-white">Take Challenges</h4>
                <p className="text-sm text-gray-300">Complete challenges for achievement avatars</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💰</div>
              <div>
                <h4 className="font-semibold text-white">Save Money</h4>
                <p className="text-sm text-gray-300">Use Piggy Bank to unlock saver avatars</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔥</div>
              <div>
                <h4 className="font-semibold text-white">Maintain Streaks</h4>
                <p className="text-sm text-gray-300">Daily login for streak avatars</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📊</div>
              <div>
                <h4 className="font-semibold text-white">Track Progress</h4>
                <p className="text-sm text-gray-300">Monitor your financial journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">👥</div>
              <div>
                <h4 className="font-semibold text-white">Social Features</h4>
                <p className="text-sm text-gray-300">Add friends for social avatars</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;