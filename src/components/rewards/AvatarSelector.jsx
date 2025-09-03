import React from 'react';
import { useApp } from '../../context/AppContext';

const AvatarSelector = ({ currentAvatar, onSelectAvatar }) => {
  const { state } = useApp();
  const { level } = state.user;
  
  // Define available avatars with their unlock requirements
  const avatars = [
    { emoji: '👤', name: 'Default', unlockLevel: 1 },
    { emoji: '👨', name: 'Man', unlockLevel: 1 },
    { emoji: '👩', name: 'Woman', unlockLevel: 1 },
    { emoji: '🧑', name: 'Person', unlockLevel: 1 },
    { emoji: '👨‍💼', name: 'Businessman', unlockLevel: 3 },
    { emoji: '👩‍💼', name: 'Businesswoman', unlockLevel: 3 },
    { emoji: '👨‍🎓', name: 'Student (M)', unlockLevel: 5 },
    { emoji: '👩‍🎓', name: 'Student (F)', unlockLevel: 5 },
    { emoji: '🧙‍♂️', name: 'Wizard', unlockLevel: 7 },
    { emoji: '🧙‍♀️', name: 'Witch', unlockLevel: 7 },
    { emoji: '👨‍🚀', name: 'Astronaut (M)', unlockLevel: 10 },
    { emoji: '👩‍🚀', name: 'Astronaut (F)', unlockLevel: 10 },
    { emoji: '👑', name: 'Crown', unlockLevel: 15 },
    { emoji: '🦸‍♂️', name: 'Superhero', unlockLevel: 20 },
    { emoji: '🦸‍♀️', name: 'Superheroine', unlockLevel: 20 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold gradient-text">Choose Your Avatar</h3>
        <div className="text-sm text-gray-300">
          Your level: <span className="text-primary-light font-medium">{level}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {avatars.map((avatar) => {
          const isUnlocked = level >= avatar.unlockLevel;
          const isSelected = currentAvatar === avatar.emoji;
          
          return (
            <div 
              key={avatar.name}
              className={`relative p-4 rounded-lg border ${isSelected 
                ? 'border-primary bg-primary/20' 
                : isUnlocked 
                  ? 'border-accent/30 hover:border-accent/60 bg-background-dark/50' 
                  : 'border-gray-700 bg-background-dark/30 opacity-50'}`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="text-4xl">{avatar.emoji}</div>
                <p className="text-sm text-center">{avatar.name}</p>
                {!isUnlocked && (
                  <div className="text-xs text-gray-400 mt-1">
                    Unlocks at level {avatar.unlockLevel}
                  </div>
                )}
              </div>
              
              {isUnlocked && (
                <button
                  onClick={() => onSelectAvatar(avatar.emoji)}
                  className={`mt-2 w-full py-1 px-2 rounded text-xs font-medium ${isSelected 
                    ? 'bg-primary text-white' 
                    : 'bg-accent/30 hover:bg-accent/50 text-white'}`}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              )}
              
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background-dark/70 rounded-lg">
                  <div className="text-2xl">🔒</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarSelector;