import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const BannerSelector = ({ unlockedBanners, onSelectBanner }) => {
  const { state, dispatch } = useApp();
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleBannerSelect = (banner) => {
    if (banner.unlocked) {
      setSelectedBanner(banner);
      setShowPreview(true);
    }
  };

  const handleEquipBanner = () => {
    if (selectedBanner && selectedBanner.unlocked) {
      dispatch({
        type: 'EQUIP_BANNER',
        payload: selectedBanner.id
      });
      
      // Show success message
      alert(`Banner "${selectedBanner.name}" equipped successfully!`);
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

  const getUnlockRequirement = (banner) => {
    if (banner.unlocked) return 'Unlocked';
    
    switch (banner.id) {
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
        return banner.unlockRequirement || 'Complete specific requirements';
    }
  };

  const renderBannerPreview = (banner) => {
    // For now, we'll use placeholder colors since we don't have actual banner images
    const bannerStyles = {
      default: 'bg-gradient-to-r from-gray-600 to-gray-800',
      ocean: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      forest: 'bg-gradient-to-r from-green-600 to-emerald-700',
      city: 'bg-gradient-to-r from-slate-600 to-gray-800',
      space: 'bg-gradient-to-r from-purple-900 to-indigo-900',
      sunset: 'bg-gradient-to-r from-orange-500 to-red-500',
      mountain: 'bg-gradient-to-r from-stone-600 to-gray-700',
      beach: 'bg-gradient-to-r from-cyan-400 to-blue-500',
      aurora: 'bg-gradient-to-r from-green-400 to-blue-500',
      galaxy: 'bg-gradient-to-r from-indigo-900 to-purple-900',
      crystal: 'bg-gradient-to-r from-pink-400 to-purple-500'
    };

    return (
      <div className={`w-full h-32 rounded-lg ${bannerStyles[banner.id] || bannerStyles.default} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
        {banner.name}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">Banner Collection</h2>
        <p className="text-gray-300">Unlock and equip banners to customize your profile appearance</p>
      </div>

      {/* Current Active Banner */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl border border-primary/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Current Active Banner</h3>
        <div className="space-y-4">
          {renderBannerPreview(
            unlockedBanners.find(b => b.id === state.user.banner) || 
            unlockedBanners.find(b => b.id === 'default')
          )}
          <div className="text-center">
            <h4 className="text-xl font-bold text-white">
              {unlockedBanners.find(b => b.id === state.user.banner)?.name || 'Default Banner'}
            </h4>
            <p className="text-gray-300">
              {unlockedBanners.find(b => b.id === state.user.banner)?.description || 'Your active banner'}
            </p>
          </div>
        </div>
      </div>

      {/* Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {unlockedBanners.map((banner) => (
          <div
            key={banner.id}
            onClick={() => handleBannerSelect(banner)}
            className={`bg-background-dark/50 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedBanner?.id === banner.id 
                ? 'border-primary shadow-lg shadow-primary/25' 
                : banner.unlocked 
                  ? 'border-accent/30 hover:border-accent/50' 
                  : 'border-gray-600 opacity-60'
            }`}
          >
            <div className="p-4">
              <div className="mb-3">
                {renderBannerPreview(banner)}
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-white">{banner.name}</h4>
                {getRarityBadge(banner.rarity)}
              </div>
              
              <p className="text-sm text-gray-300 mb-3">{banner.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Status:</span>
                  <span className={banner.unlocked ? 'text-green-400' : 'text-red-400'}>
                    {banner.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                
                {!banner.unlocked && (
                  <div className="text-xs text-gray-400">
                    <span className="block">Requirement:</span>
                    <span className="text-yellow-400">{getUnlockRequirement(banner)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Preview Modal */}
      {showPreview && selectedBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-dark rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Banner Preview</h3>
              <button
                onClick={() => {
                  setSelectedBanner(null);
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
                <h4 className="text-xl font-bold text-white mb-2">{selectedBanner.name}</h4>
                <p className="text-gray-300 mb-3">{selectedBanner.description}</p>
                {getRarityBadge(selectedBanner.rarity)}
              </div>

              <div className="mb-4">
                {renderBannerPreview(selectedBanner)}
              </div>

              {state.user.banner === selectedBanner.id ? (
                <div className="text-center p-3 bg-primary/20 border border-primary/30 rounded-lg">
                  <p className="text-primary font-medium">Currently Equipped</p>
                </div>
              ) : (
                <button
                  onClick={handleEquipBanner}
                  className="w-full bg-primary hover:bg-primary/80 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Equip Banner
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* How to Unlock More Banners */}
      <div className="bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-xl border border-blue-400/20 p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">How to Unlock More Banners</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📚</div>
              <div>
                <h4 className="font-semibold text-white">Complete Lessons</h4>
                <p className="text-sm text-gray-300">Finish lessons to unlock themed banners</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h4 className="font-semibold text-white">Take Challenges</h4>
                <p className="text-sm text-gray-300">Complete challenges for achievement banners</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔥</div>
              <div>
                <h4 className="font-semibold text-white">Maintain Streaks</h4>
                <p className="text-sm text-gray-300">Daily login for streak banners</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💰</div>
              <div>
                <h4 className="font-semibold text-white">Save Money</h4>
                <p className="text-sm text-gray-300">Use Piggy Bank to unlock saver banners</p>
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
                <p className="text-sm text-gray-300">Add friends for social banners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSelector;