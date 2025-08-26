import React from 'react';
import { useApp } from '../../context/AppContext';
import './Header.css';

const Header = () => {
  const { state } = useApp();
  const { user } = state;

  const progress = (user.xp / user.nextLevelXp) * 100;

  return (
    <header className="header">
      <div className="container flex-between">
        <div className="logo">
          <h1>FinLit</h1>
        </div>
        
        <div className="user-info flex gap-1">
          <div className="user-level">
            <div className="level-badge">Lvl {user.level}</div>
          </div>
          
          <div className="user-stats">
            <div className="xp-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="xp-text">
                {user.xp} / {user.nextLevelXp} XP
              </div>
            </div>
            
            <div className="coins flex-center gap-1">
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