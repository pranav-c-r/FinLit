import React from 'react';
import { Link, useLocation } from 'react-router-dom';


const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/lessons', icon: '📚', label: 'Lessons' },
    { path: '/challenges', icon: '🎯', label: 'Challenges' },
    { path: '/goals', icon: '🎯', label: 'Goals' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 flex justify-around p-3 border-t border-gray-700 z-50 md:hidden">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center text-gray-400 text-xs transition-all duration-300 p-2 rounded-lg hover:text-finlit-blue-light hover:bg-gray-800 ${location.pathname === item.path ? 'text-finlit-blue-light bg-gray-800' : ''}`}
        >
          <span className="text-xl mb-1">{item.icon}</span>
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;