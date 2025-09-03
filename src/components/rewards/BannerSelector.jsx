import React from 'react';

const BannerSelector = ({ currentBanner, unlockedBanners, onSelectBanner }) => {
  // Define all available banners with their details
  const allBanners = [
    { 
      id: 'default', 
      name: 'Default', 
      description: 'Standard banner for all users',
      gradient: 'from-primary/30 to-background-dark',
      unlockCriteria: 'Available to all users'
    },
    { 
      id: 'bronze', 
      name: 'Bronze Achievement', 
      description: 'Earned by reaching level 5',
      gradient: 'from-amber-700/50 to-amber-900/50',
      unlockCriteria: 'Reach level 5'
    },
    { 
      id: 'silver', 
      name: 'Silver Achievement', 
      description: 'Earned by reaching level 10',
      gradient: 'from-gray-400/50 to-gray-600/50',
      unlockCriteria: 'Reach level 10'
    },
    { 
      id: 'gold', 
      name: 'Gold Achievement', 
      description: 'Earned by reaching level 15',
      gradient: 'from-yellow-400/50 to-yellow-600/50',
      unlockCriteria: 'Reach level 15'
    },
    { 
      id: 'streak-bronze', 
      name: 'Bronze Streak', 
      description: 'Earned by maintaining a 3-day streak',
      gradient: 'from-amber-700/50 via-amber-600/30 to-background-dark',
      unlockCriteria: 'Maintain a 3-day login streak'
    },
    { 
      id: 'streak-silver', 
      name: 'Silver Streak', 
      description: 'Earned by maintaining a 7-day streak',
      gradient: 'from-gray-400/50 via-gray-500/30 to-background-dark',
      unlockCriteria: 'Maintain a 7-day login streak'
    },
    { 
      id: 'streak-gold', 
      name: 'Gold Streak', 
      description: 'Earned by maintaining a 14-day streak',
      gradient: 'from-yellow-400/50 via-yellow-500/30 to-background-dark',
      unlockCriteria: 'Maintain a 14-day login streak'
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold gradient-text">Profile Banners</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allBanners.map((banner) => {
          const isUnlocked = unlockedBanners.includes(banner.id);
          const isSelected = currentBanner === banner.id;
          
          return (
            <div 
              key={banner.id}
              className={`relative rounded-lg overflow-hidden border ${isSelected 
                ? 'border-primary' 
                : isUnlocked 
                  ? 'border-accent/30' 
                  : 'border-gray-700 opacity-60'}`}
            >
              {/* Banner Preview */}
              <div className={`h-24 bg-gradient-to-r ${banner.gradient} p-4 flex items-end`}>
                <div className="z-10">
                  <h4 className="text-white font-medium">{banner.name}</h4>
                </div>
              </div>
              
              {/* Banner Info */}
              <div className="p-4 bg-background-dark/80">
                <p className="text-sm text-gray-300 mb-3">{banner.description}</p>
                
                <div className="flex justify-between items-center">
                  {!isUnlocked && (
                    <div className="text-xs text-gray-400">
                      <span className="mr-1">🔒</span> {banner.unlockCriteria}
                    </div>
                  )}
                  
                  {isUnlocked && (
                    <button
                      onClick={() => onSelectBanner(banner.id)}
                      className={`py-1 px-3 rounded text-sm font-medium ${isSelected 
                        ? 'bg-primary text-white' 
                        : 'bg-accent/30 hover:bg-accent/50 text-white'}`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Locked Overlay */}
              {!isUnlocked && (
                <div className="absolute inset-0 bg-background-dark/50 flex items-center justify-center">
                  <div className="text-3xl">🔒</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BannerSelector;