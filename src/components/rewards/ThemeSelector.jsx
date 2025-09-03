import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const ThemeSelector = ({ unlockedThemes, onSelectTheme }) => {
  const { state, dispatch } = useApp();
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleThemeSelect = (theme) => {
    if (theme.unlocked) {
      setSelectedTheme(theme);
      setShowPreview(true);
    }
  };

  const handleEquipTheme = () => {
    if (selectedTheme && selectedTheme.unlocked) {
      dispatch({
        type: 'SET_THEME',
        payload: selectedTheme.id
      });
      
      // Show success message
      alert(`Theme "${selectedTheme.name}" equipped successfully!`);
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

  const getUnlockRequirement = (theme) => {
    if (theme.unlocked) return 'Unlocked';
    
    switch (theme.id) {
      case 'ocean':
        return 'Reach Level 3';
      case 'forest':
        return 'Complete 10 lessons';
      case 'city':
        return 'Complete 5 challenges';
      case 'space':
        return 'Maintain 14-day streak';
      case 'sunset':
        return 'Save ₹25,000 in Piggy Bank';
      case 'mountain':
        return 'Complete 25 quests';
      case 'beach':
        return 'Add 5 friends';
      case 'aurora':
        return 'Track 50 expenses';
      case 'galaxy':
        return 'Reach Level 15';
      case 'crystal':
        return 'Complete all lessons';
      default:
        return theme.unlockRequirement || 'Complete specific requirements';
    }
  };

  const renderThemePreview = (theme) => {
    const themeStyles = {
      default: {
        primary: '#3B82F6',
        secondary: '#10B981',
        background: '#0F172A'
      },
      ocean: {
        primary: '#0EA5E9',
        secondary: '#06B6D4',
        background: '#0C4A6E'
      },
      forest: {
        primary: '#059669',
        secondary: '#10B981',
        background: '#064E3B'
      },
      city: {
        primary: '#475569',
        secondary: '#64748B',
        background: '#1E293B'
      },
      space: {
        primary: '#7C3AED',
        secondary: '#8B5CF6',
        background: '#1E1B4B'
      },
      sunset: {
        primary: '#F59E0B',
        secondary: '#EF4444',
        background: '#7C2D12'
      },
      mountain: {
        primary: '#78716C',
        secondary: '#A8A29E',
        background: '#292524'
      },
      beach: {
        primary: '#06B6D4',
        secondary: '#3B82F6',
        background: '#0E7490'
      },
      aurora: {
        primary: '#10B981',
        secondary: '#06B6D4',
        background: '#064E3B'
      },
      galaxy: {
        primary: '#4F46E5',
        secondary: '#7C3AED',
        background: '#1E1B4B'
      },
      crystal: {
        primary: '#EC4899',
        secondary: '#8B5CF6',
        background: '#831843'
      }
    };

    const colors = themeStyles[theme.id] || themeStyles.default;

    return (
      <div className="space-y-3">
        <div className="flex space-x-2">
          <div 
            className="w-8 h-8 rounded border-2 border-white"
            style={{ backgroundColor: colors.primary }}
          ></div>
          <div 
            className="w-8 h-8 rounded border-2 border-white"
            style={{ backgroundColor: colors.secondary }}
          ></div>
          <div 
            className="w-8 h-8 rounded border-2 border-white"
            style={{ backgroundColor: colors.background }}
          ></div>
        </div>
        <div className="text-xs text-gray-400">
          Primary • Secondary • Background
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">Theme Collection</h2>
        <p className="text-gray-300">Unlock and equip themes to customize your app appearance</p>
      </div>

      {/* Current Active Theme */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl border border-primary/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Current Active Theme</h3>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl">
            🎨
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-white">
              {unlockedThemes.find(t => t.id === state.user.theme)?.name || 'Default Theme'}
            </h4>
            <p className="text-gray-300">
              {unlockedThemes.find(t => t.id === state.user.theme)?.description || 'Your active theme'}
            </p>
          </div>
          <div>
            {renderThemePreview(
              unlockedThemes.find(t => t.id === state.user.theme) || 
              unlockedThemes.find(t => t.id === 'default')
            )}
          </div>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {unlockedThemes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => handleThemeSelect(theme)}
            className={`bg-background-dark/50 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedTheme?.id === theme.id 
                ? 'border-primary shadow-lg shadow-primary/25' 
                : theme.unlocked 
                  ? 'border-accent/30 hover:border-accent/50' 
                  : 'border-gray-600 opacity-60'
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">🎨</div>
                {getRarityBadge(theme.rarity)}
              </div>
              
              <h4 className="text-lg font-semibold text-white mb-2">{theme.name}</h4>
              <p className="text-sm text-gray-300 mb-3">{theme.description}</p>
              
              <div className="mb-3">
                {renderThemePreview(theme)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Status:</span>
                  <span className={theme.unlocked ? 'text-green-400' : 'text-red-400'}>
                    {theme.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                
                {!theme.unlocked && (
                  <div className="text-xs text-gray-400">
                    <span className="block">Requirement:</span>
                    <span className="text-yellow-400">{getUnlockRequirement(theme)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Theme Preview Modal */}
      {showPreview && selectedTheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-dark rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Theme Preview</h3>
              <button
                onClick={() => {
                  setSelectedTheme(null);
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
                <h4 className="text-xl font-bold text-white mb-2">{selectedTheme.name}</h4>
                <p className="text-gray-300 mb-3">{selectedTheme.description}</p>
                {getRarityBadge(selectedTheme.rarity)}
              </div>

              <div className="mb-4">
                {renderThemePreview(selectedTheme)}
              </div>

              {state.user.theme === selectedTheme.id ? (
                <div className="text-center p-3 bg-primary/20 border border-primary/30 rounded-lg">
                  <p className="text-primary font-medium">Currently Equipped</p>
                </div>
              ) : (
                <button
                  onClick={handleEquipTheme}
                  className="w-full bg-primary hover:bg-primary/80 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Equip Theme
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* How to Unlock More Themes */}
      <div className="bg-gradient-to-r from-pink-400/10 to-purple-400/10 rounded-xl border border-pink-400/20 p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">How to Unlock More Themes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📚</div>
              <div>
                <h4 className="font-semibold text-white">Complete Lessons</h4>
                <p className="text-sm text-gray-300">Finish lessons to unlock themed appearances</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h4 className="font-semibold text-white">Take Challenges</h4>
                <p className="text-sm text-gray-300">Complete challenges for achievement themes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔥</div>
              <div>
                <h4 className="font-semibold text-white">Maintain Streaks</h4>
                <p className="text-sm text-gray-300">Daily login for streak themes</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💰</div>
              <div>
                <h4 className="font-semibold text-white">Save Money</h4>
                <p className="text-sm text-gray-300">Use Piggy Bank to unlock saver themes</p>
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
                <p className="text-sm text-gray-300">Add friends for social themes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;