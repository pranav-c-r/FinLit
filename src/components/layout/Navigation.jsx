import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: '🏠', label: 'Home' },
    { path: '/lessons', icon: '📚', label: 'Lessons' },
    { path: '/challenges', icon: '🎯', label: 'Challenges' },
    { path: '/goals', icon: '🚩', label: 'Goals' },
    { path: '/piggy-bank', icon: '🐷', label: 'Piggy Bank' },
    { path: '/daily-quests', icon: '✨', label: 'Daily Quests' },
    { path: '/expense-tracker', icon: '💰', label: 'Expenses' },
    { path: '/rewards', icon: '🎁', label: 'Rewards' },
    { path: '/achievements', icon: '🏅', label: 'Achievements' },
    { path: '/social', icon: '👥', label: 'Social' },
    { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background-dark/90 backdrop-blur-md border-t border-accent/30 shadow-lg shadow-primary/20 p-2 md:hidden z-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-32 h-32 bg-primary-light/30 rounded-full blur-2xl -bottom-16 -left-16 animate-pulse-slow" />
        <div className="absolute w-24 h-24 bg-primary/20 rounded-full blur-xl -top-12 right-8 animate-pulse-slower animate-delay-1000" />
      </div>
      <nav className="flex justify-around items-center">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${location.pathname === item.path ? 'text-white scale-110' : 'text-gray-300'} hover:text-white animate-fade-in-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}      </nav>
    </div>
  );
};

export default Navigation;
