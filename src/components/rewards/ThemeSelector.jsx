import React from 'react';

const ThemeSelector = ({ currentTheme, unlockedThemes, onSelectTheme }) => {
  // Define all available themes with their details
  const allThemes = [
    { 
      id: 'default', 
      name: 'Default', 
      description: 'Standard dark theme with blue accents',
      colors: {
        primary: '#00A1FF',
        secondary: '#6EFF00',
        background: '#1a1f2e'
      },
      unlockCriteria: 'Available to all users'
    },
    { 
      id: 'dark', 
      name: 'Deep Dark', 
      description: 'A darker theme with subtle accents',
      colors: {
        primary: '#4F46E5',
        secondary: '#10B981',
        background: '#111827'
      },
      unlockCriteria: 'Available to all users'
    },
    { 
      id: 'ocean', 
      name: 'Ocean Depths', 
      description: 'Cool blue and teal theme',
      colors: {
        primary: '#0EA5E9',
        secondary: '#06B6D4',
        background: '#0F172A'
      },
      unlockCriteria: 'Reach level 3'
    },
    { 
      id: 'forest', 
      name: 'Enchanted Forest', 
      description: 'Green and earth tones',
      colors: {
        primary: '#10B981',
        secondary: '#84CC16',
        background: '#1E293B'
      },
      unlockCriteria: 'Reach level 7'
    },
    { 
      id: 'sunset', 
      name: 'Sunset Glow', 
      description: 'Warm orange and purple tones',
      colors: {
        primary: '#F59E0B',
        secondary: '#8B5CF6',
        background: '#1E1B4B'
      },
      unlockCriteria: 'Reach level 12'
    },
    { 
      id: 'scholar', 
      name: 'Scholar', 
      description: 'Academic-themed with gold accents',
      colors: {
        primary: '#CA8A04',
        secondary: '#4F46E5',
        background: '#1F2937'
      },
      unlockCriteria: 'Complete 5 lessons'
    },
    { 
      id: 'challenger', 
      name: 'Challenger', 
      description: 'Bold red and black theme for achievers',
      colors: {
        primary: '#DC2626',
        secondary: '#2563EB',
        background: '#18181B'
      },
      unlockCriteria: 'Complete 3 challenges'
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold gradient-text">UI Themes</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allThemes.map((theme) => {
          const isUnlocked = unlockedThemes.includes(theme.id);
          const isSelected = currentTheme === theme.id;
          
          return (
            <div 
              key={theme.id}
              className={`relative rounded-lg overflow-hidden border ${isSelected 
                ? 'border-primary' 
                : isUnlocked 
                  ? 'border-accent/30' 
                  : 'border-gray-700 opacity-60'}`}
            >
              {/* Theme Preview */}
              <div 
                className="h-24 p-4 flex items-end"
                style={{ backgroundColor: theme.colors.background }}
              >
                <div className="flex space-x-2">
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                </div>
              </div>
              
              {/* Theme Info */}
              <div className="p-4 bg-background-dark/80">
                <h4 className="font-medium mb-1">{theme.name}</h4>
                <p className="text-sm text-gray-300 mb-3">{theme.description}</p>
                
                <div className="flex justify-between items-center">
                  {!isUnlocked && (
                    <div className="text-xs text-gray-400">
                      <span className="mr-1">🔒</span> {theme.unlockCriteria}
                    </div>
                  )}
                  
                  {isUnlocked && (
                    <button
                      onClick={() => onSelectTheme(theme.id)}
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

export default ThemeSelector;