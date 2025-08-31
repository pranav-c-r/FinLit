import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getUnlockedItems } from '../../data/rewards';
import AvatarSelector from './AvatarSelector';
import BannerSelector from './BannerSelector';
import ThemeSelector from './ThemeSelector';
import TitleSelector from './TitleSelector';

const RewardSystem = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('avatars');

  const unlockedItems = getUnlockedItems(state.user);

  const handleEquipAvatar = (avatarId) => {
    // This will be handled by the AvatarSelector component
  };

  const handleEquipBanner = (bannerId) => {
    // This will be handled by the BannerSelector component
  };

  const handleEquipTheme = (themeId) => {
    // This will be handled by the ThemeSelector component
  };

  const handleSelectTitle = (titleId) => {
    // This will be handled by the TitleSelector component
  };

  const tabs = [
    { id: 'avatars', label: 'Avatars', icon: '👤' },
    { id: 'banners', label: 'Banners', icon: '🖼️' },
    { id: 'themes', label: 'Themes', icon: '🎨' },
    { id: 'titles', label: 'Titles', icon: '👑' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'avatars':
        return (
          <AvatarSelector 
            unlockedAvatars={unlockedItems.avatars}
            onSelectAvatar={handleEquipAvatar}
          />
        );
      case 'banners':
        return (
          <BannerSelector 
            unlockedBanners={unlockedItems.banners}
            onSelectBanner={handleEquipBanner}
          />
        );
      case 'themes':
        return (
          <ThemeSelector 
            unlockedThemes={unlockedItems.themes}
            onSelectTheme={handleEquipTheme}
          />
        );
      case 'titles':
        return <TitleSelector />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-2">Reward System</h1>
        <p className="text-gray-300">Unlock and equip rewards to customize your experience</p>
        
        {/* User Stats */}
        <div className="mt-6 flex justify-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{state.user.level}</div>
            <div className="text-sm text-gray-400">Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{state.user.xp}</div>
            <div className="text-sm text-gray-400">XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{state.user.coins}</div>
            <div className="text-sm text-gray-400">Coins</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-background-dark/50 rounded-lg p-1 border border-accent/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-background-light/20'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>

      {/* Reward System Info */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20 p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">How the Reward System Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h4 className="font-semibold text-white">Complete Activities</h4>
                <p className="text-sm text-gray-300">Finish lessons, challenges, and quests to earn XP and coins</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💰</div>
              <div>
                <h4 className="font-semibold text-white">Earn Rewards</h4>
                <p className="text-sm text-gray-300">Use coins to unlock new avatars, banners, and themes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔥</div>
              <div>
                <h4 className="font-semibold text-white">Build Streaks</h4>
                <p className="text-sm text-gray-300">Daily login and activity to unlock exclusive rewards</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📚</div>
              <div>
                <h4 className="font-semibold text-white">Learn & Grow</h4>
                <p className="text-sm text-gray-300">Progress through levels to unlock higher-tier rewards</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">👥</div>
              <div>
                <h4 className="font-semibold text-white">Social Features</h4>
                <p className="text-sm text-gray-300">Connect with friends to unlock social rewards</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🏆</div>
              <div>
                <h4 className="font-semibold text-white">Achievements</h4>
                <p className="text-sm text-gray-300">Complete milestones to earn special titles and badges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardSystem;