import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const Header = ({ toggleSidebar }) => {
  const { state } = useApp();
  const { user } = state;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const progress = (user.xp / user.nextLevelXp) * 100;

  // Simulate a new notification
  useEffect(() => {
    const notificationTimer = setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }, 2000);

    return () => clearTimeout(notificationTimer);
  }, []);

  return (
    <header className="bg-background-DEFAULT p-4 border-b border-accent sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Hamburger menu icon for mobile */}
        <button 
          className="md:hidden text-white mr-4 focus:outline-none"
          onClick={toggleSidebar}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo with animation */}
        <div className="flex items-center">
          <div className="text-2xl font-bold relative">
            <span className="gradient-text">
              FinLit
            </span>
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary-light to-primary rounded-full"></div>
          </div>
        </div>
        
        {/* User info and progress */}
        <div className="flex items-center space-x-4">
          {/* Notification bell with animation */}
          <div className="relative">
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-background-light text-white hover:text-primary-light transition-all duration-300 hover:scale-110"
              onClick={() => setShowNotification(!showNotification)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            {/* Notification indicator */}
            {showNotification && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-light rounded-full animate-ping"></div>
            )}
            
            {/* Notification dropdown */}
            {showNotification && (
              <div className="absolute right-0 top-12 w-72 bg-background-light rounded-xl shadow-xl border border-accent p-4 animate-fade-in">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-primary-light rounded-full mr-2"></div>
                  <h3 className="gradient-text font-semibold">New Achievement!</h3>
                </div>
                <p className="text-gray-300 text-sm">You've earned 50 XP for completing your daily goal!</p>
              </div>
            )}
          </div>

          {/* Level badge with animation */}
          <div className="relative">
            <div 
              className="bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] text-[#01110A] px-3 py-1 rounded-full font-bold text-sm flex items-center transform transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span>Lvl {user.level}</span>
            </div>
            
            {/* Level progress tooltip */}
            {isExpanded && (
              <div className="absolute right-0 top-12 w-64 bg-[#0A1F14] rounded-xl shadow-xl border border-[#1C3B2A] p-4 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#80A1C1] text-sm">Level Progress</span>
                  <span className="text-[#F4E87C] font-bold text-sm">{Math.round(progress)}%</span>
                </div>
                
                <div className="w-full h-2 bg-[#0C291C] rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-gradient-to-r from-[#80A1C1] to-[#F4E87C] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-[#80A1C1] flex justify-between">
                  <span>{user.xp} XP</span>
                  <span>{user.nextLevelXp} XP</span>
                </div>
              </div>
            )}
          </div>
          
          {/* XP progress bar (desktop only) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex flex-col items-end space-y-1">
              <div className="w-32 h-2 bg-[#0C291C] rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-[#80A1C1] to-[#F4E87C] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-[#80A1C1]">
                {user.xp} / {user.nextLevelXp} XP
              </div>
            </div>
            
            {/* Coins display */}
            <div className="bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] px-3 py-1 rounded-full text-sm flex items-center space-x-1 transform transition-all duration-300 hover:scale-105">
              <span className="coin-icon">🪙</span>
              <span className="text-[#01110A] font-bold">{user.coins}</span>
            </div>
          </div>

          {/* User avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#80A1C1] to-[#5C7A9E] flex items-center justify-center text-white font-bold shadow-lg transform transition-all duration-300 hover:scale-110">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;