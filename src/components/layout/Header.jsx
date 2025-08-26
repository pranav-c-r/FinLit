import React from 'react';
import { useApp } from '../../context/AppContext';


const Header = () => {
  const { state } = useApp();
  const { user } = state;

  const progress = (user.xp / user.nextLevelXp) * 100;

  return (
    <header className="bg-gray-900 p-4 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-finlit-blue-light text-2xl font-bold">
          FinLit
        </div>
        
        <div className="flex items-center space-x-4">
          <div>
            <span className="bg-orange-500 text-gray-900 px-3 py-1 rounded-full font-semibold text-sm">Lvl {user.level}</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex flex-col items-end space-y-1">
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400">
                {user.xp} / {user.nextLevelXp} XP
              </div>
            </div>
            
            <div className="bg-cyan-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
              <span className="coin-icon">🪙</span>
              <span>{user.coins}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;