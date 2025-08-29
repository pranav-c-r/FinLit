import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AvatarSelector from './AvatarSelector';
import BannerSelector from './BannerSelector';
import ThemeSelector from './ThemeSelector';
import TitleSelector from './TitleSelector';

const RewardSystem = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('avatars');
  
  const handleUpdateProfile = (updates) => {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: updates
    });
  };
  
  const handleSetActiveTitle = (title) => {
    dispatch({
      type: 'SET_ACTIVE_TITLE',
      payload: { title }
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'avatars':
        return <AvatarSelector 
                 currentAvatar={state.user.avatar} 
                 onSelectAvatar={(avatar) => handleUpdateProfile({ avatar })} 
               />;
      case 'banners':
        return <BannerSelector 
                 currentBanner={state.user.banner} 
                 unlockedBanners={getUnlockedBanners()} 
                 onSelectBanner={(banner) => handleUpdateProfile({ banner })} 
               />;
      case 'themes':
        return <ThemeSelector 
                 currentTheme={state.user.theme} 
                 unlockedThemes={getUnlockedThemes()} 
                 onSelectTheme={(theme) => handleUpdateProfile({ theme })} 
               />;
      case 'titles':
        return <TitleSelector 
                 titles={state.user.titles} 
                 activeTitle={state.user.activeTitle} 
                 onSelectTitle={handleSetActiveTitle} 
               />;
      default:
        return <div>Select a tab</div>;
    }
  };
  
  // Helper functions to determine unlocked items based on user progress
  const getUnlockedBanners = () => {
    const { level, streak } = state.user;
    const unlockedBanners = ['default'];
    
    if (level >= 5) unlockedBanners.push('bronze');
    if (level >= 10) unlockedBanners.push('silver');
    if (level >= 15) unlockedBanners.push('gold');
    
    if (streak >= 3) unlockedBanners.push('streak-bronze');
    if (streak >= 7) unlockedBanners.push('streak-silver');
    if (streak >= 14) unlockedBanners.push('streak-gold');
    
    return unlockedBanners;
  };
  
  const getUnlockedThemes = () => {
    const { level, completedLessons, completedChallenges } = state.user;
    const unlockedThemes = ['default', 'dark'];
    
    if (level >= 3) unlockedThemes.push('ocean');
    if (level >= 7) unlockedThemes.push('forest');
    if (level >= 12) unlockedThemes.push('sunset');
    
    if (completedLessons.length >= 5) unlockedThemes.push('scholar');
    if (completedChallenges.length >= 3) unlockedThemes.push('challenger');
    
    return unlockedThemes;
  };

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-background-dark/50 p-4 rounded-lg border border-accent/30">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-4xl">
            {state.user.avatar}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{state.user.name}</h3>
            <p className="text-sm text-gray-300">{state.user.activeTitle}</p>
          </div>
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <div className="text-center">
            <p className="text-sm text-gray-300">Level</p>
            <p className="text-xl font-bold gradient-text">{state.user.level}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-300">XP</p>
            <p className="text-xl font-bold gradient-text-secondary">{state.user.xp}/{state.user.nextLevelXp}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-300">Streak</p>
            <p className="text-xl font-bold gradient-text-tertiary">{state.user.streak} days</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-accent/30">
        <nav className="-mb-px flex space-x-8">
          {['avatars', 'banners', 'themes', 'titles'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="py-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default RewardSystem;