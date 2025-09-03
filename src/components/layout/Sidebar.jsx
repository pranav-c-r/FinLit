import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: '🏠', label: 'Home' },
    { path: '/lessons', icon: '📚', label: 'Lessons' },
    { path: '/challenges', icon: '🎯', label: 'Challenges' },
    { path: '/goals', icon: '🎯', label: 'Goals' },
    { path: '/piggybank', icon: '🐷', label: 'Piggy Bank' },
    { path: '/daily-quests', icon: '✨', label: 'Daily Quests' },
    { path: '/expenses', icon: '💰', label: 'Expenses' },
    { path: '/rewards', icon: '🎁', label: 'Rewards' },
    { path: '/achievements', icon: '🏅', label: 'Achievements' },
    { path: '/social', icon: '👥', label: 'Social' },
    { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-background-dark/90 backdrop-blur-md border-r border-accent/30 h-screen fixed left-0 top-0 z-40">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-64 h-64 bg-primary-light/30 rounded-full blur-3xl -top-32 -left-32 animate-pulse-slow" />
        <div className="absolute w-48 h-48 bg-primary/20 rounded-full blur-2xl bottom-16 right-8 animate-pulse-slower animate-delay-1000" />
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent animate-fade-in">FinLit</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 animate-fade-in-up ${location.pathname === item.path ? 'bg-primary/20 text-white' : 'text-gray-300 hover:bg-primary/10 hover:text-white'}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-background-light/50 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
          <span className="text-2xl">👋</span>
          <div className="flex-1">
            <p className="text-sm text-gray-300">Welcome back</p>
            <p className="text-sm font-medium text-white">User123</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
